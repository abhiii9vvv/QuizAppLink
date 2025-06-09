"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  Pause,
  Play,
  Settings,
  BarChart3,
  Trophy,
  Zap,
  Home,
} from "lucide-react"

import type { Question, UserStats, QuizSettings, Achievement, PowerUp } from "./types/quiz"
import { questionBank, categories } from "./data/questions"
import { achievementTemplates } from "./data/achievements"
import { useLocalStorage } from "./hooks/use-local-storage"
import { useSound } from "./hooks/use-sound"
import { QuizSettingsComponent } from "./components/quiz-settings"
import { UserStatsComponent } from "./components/user-stats"
import { AchievementsModal } from "./components/achievements-modal"
import { DeveloperCredits, DeveloperCornerButton } from "./components/developer-credits"

const defaultSettings: QuizSettings = {
  theme: "light",
  soundEnabled: true,
  timerMode: "per-question",
  difficulty: "mixed",
  categories: categories,
  questionCount: 10,
}

const defaultStats: UserStats = {
  totalQuizzes: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  streak: 0,
  bestStreak: 0,
  totalXP: 0,
  level: 1,
  averageTime: 0,
  categoryStats: {},
  achievements: achievementTemplates.map((template) => ({
    ...template,
    unlocked: false,
  })),
}

export default function EnhancedQuizApp() {
  // Core quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState<number>(0)
  const [questionStartTime, setQuestionStartTime] = useState<number>(0)

  // Timer state
  const [currentQuestionTime, setCurrentQuestionTime] = useState(30)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(300)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timeUp, setTimeUp] = useState(false)

  // UI state
  const [currentView, setCurrentView] = useState<"home" | "quiz" | "settings" | "stats">("home")
  const [showAchievements, setShowAchievements] = useState(false)
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [showDeveloperPopup, setShowDeveloperPopup] = useState(false)

  // Persistent data
  const [settings, setSettings] = useLocalStorage("quiz-settings", defaultSettings)
  const [userStats, setUserStats] = useLocalStorage("quiz-stats", defaultStats)

  // Hooks
  const { playSound } = useSound()

  // Power-ups state
  const [powerUps] = useState<PowerUp[]>([
    { id: "extra-time", name: "Extra Time", description: "+15 seconds", icon: "⏰", cost: 50, uses: 3 },
    { id: "fifty-fifty", name: "50/50", description: "Remove 2 wrong answers", icon: "🎯", cost: 75, uses: 2 },
    { id: "skip", name: "Skip Question", description: "Skip current question", icon: "⏭️", cost: 100, uses: 1 },
  ])
  const [usedPowerUps, setUsedPowerUps] = useState<string[]>([])

  // Power-up handlers
  const usePowerUp = useCallback(
    (powerUpId: string) => {
      if (usedPowerUps.includes(powerUpId)) return

      const powerUp = powerUps.find((p) => p.id === powerUpId)
      if (!powerUp || userStats.totalXP < powerUp.cost) return

      setUsedPowerUps([...usedPowerUps, powerUpId])

      // Deduct XP cost
      setUserStats((prevStats) => ({
        ...prevStats,
        totalXP: prevStats.totalXP - powerUp.cost,
      }))

      switch (powerUpId) {
        case "extra-time":
          setCurrentQuestionTime((prev) => prev + 15)
          break
        case "fifty-fifty":
          // Remove 2 incorrect options (implementation would modify question display)
          break
        case "skip":
          // Handle skip by setting a flag that will be processed in useEffect
          setSelectedAnswer(-1) // Use -1 as a special value for skip
          setShowResult(true)
          break
      }
    },
    [powerUps, usedPowerUps, userStats, setUserStats],
  )

  const PowerUpButton = ({ powerUp }: { powerUp: PowerUp }) => {
    const disabled = usedPowerUps.includes(powerUp.id) || userStats.totalXP < powerUp.cost
    const handlePowerUpClick = useCallback(() => {
      usePowerUp(powerUp.id)
    }, [usePowerUp, powerUp.id])

    return (
      <Button
        key={powerUp.id}
        variant="outline"
        size="sm"
        onClick={handlePowerUpClick}
        disabled={disabled}
        className="text-xs"
      >
        {powerUp.icon} {powerUp.name} ({powerUp.cost} XP)
      </Button>
    )
  }

  // Achievement checking function
  const checkAchievements = useCallback(
    (newStats: UserStats, finalScore: number, questionsLength: number, startTime: number, completed: boolean) => {
      const unlockedAchievements: Achievement[] = []

      newStats.achievements.forEach((achievement) => {
        if (!achievement.unlocked) {
          let shouldUnlock = false

          switch (achievement.id) {
            case "first-quiz":
              shouldUnlock = newStats.totalQuizzes >= 1
              break
            case "perfect-score":
              shouldUnlock = finalScore === questionsLength && questionsLength > 0
              break
            case "speed-demon":
              shouldUnlock = Date.now() - startTime < 120000 && completed
              break
            case "streak-5":
              shouldUnlock = newStats.bestStreak >= 5
              break
            case "streak-10":
              shouldUnlock = newStats.bestStreak >= 10
              break
            case "category-master-science":
              shouldUnlock = (newStats.categoryStats["Science"]?.correct || 0) >= 20
              break
            case "category-master-math":
              shouldUnlock = (newStats.categoryStats["Math"]?.correct || 0) >= 20
              break
            case "level-5":
              shouldUnlock = newStats.level >= 5
              break
            case "level-10":
              shouldUnlock = newStats.level >= 10
              break
            case "hundred-questions":
              shouldUnlock = newStats.totalQuestions >= 100
              break
          }

          if (shouldUnlock) {
            achievement.unlocked = true
            achievement.unlockedAt = new Date()
            unlockedAchievements.push(achievement)
          }
        }
      })

      if (unlockedAchievements.length > 0) {
        setNewAchievements(unlockedAchievements)
        setShowAchievements(true)
        if (settings.soundEnabled) playSound("achievement")
      }

      return newStats
    },
    [settings.soundEnabled, playSound],
  )

  // Complete quiz function
  const completeQuiz = useCallback(
    (finalScore: number, finalStreak: number) => {
      setQuizCompleted(true)
      setIsTimerActive(false)

      if (settings.soundEnabled) playSound("complete")

      // Calculate XP and level
      const baseXP = finalScore * 10
      const streakBonus = Math.floor(finalStreak / 3) * 5
      const speedBonus = settings.timerMode !== "none" && Date.now() - quizStartTime < 180000 ? 20 : 0
      const totalXP = baseXP + streakBonus + speedBonus

      // Update stats
      const newStats: UserStats = {
        ...userStats,
        totalQuizzes: userStats.totalQuizzes + 1,
        totalQuestions: userStats.totalQuestions + questions.length,
        correctAnswers: userStats.correctAnswers + finalScore,
        streak: finalStreak,
        bestStreak: Math.max(userStats.bestStreak, finalStreak),
        totalXP: userStats.totalXP + totalXP,
        level: Math.floor((userStats.totalXP + totalXP) / 100) + 1,
        averageTime: (userStats.averageTime + (Date.now() - quizStartTime)) / 2,
        categoryStats: { ...userStats.categoryStats },
      }

      // Update category stats
      questions.forEach((question, index) => {
        const category = question.category
        if (!newStats.categoryStats[category]) {
          newStats.categoryStats[category] = { correct: 0, total: 0 }
        }
        newStats.categoryStats[category].total += 1
        if (answers[index] === question.correctAnswer) {
          newStats.categoryStats[category].correct += 1
        }
      })

      const finalStats = checkAchievements(newStats, finalScore, questions.length, quizStartTime, true)
      setUserStats(finalStats)
    },
    [
      settings.soundEnabled,
      settings.timerMode,
      playSound,
      userStats,
      questions,
      answers,
      quizStartTime,
      checkAchievements,
      setUserStats,
    ],
  )

  // Handle next question
  const handleNext = useCallback(() => {
    const isCorrect = selectedAnswer === questions[currentQuestion]?.correctAnswer
    let newScore = score
    let newStreak = currentStreak

    if (isCorrect) {
      newScore += 1
      newStreak += 1
      if (settings.soundEnabled) playSound("correct")
    } else {
      newStreak = 0
      if (settings.soundEnabled) playSound("incorrect")
    }

    setScore(newScore)
    setCurrentStreak(newStreak)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
      setShowResult(false)

      if (settings.timerMode === "per-question") {
        setCurrentQuestionTime(30)
        setTimeUp(false)
        setIsTimerActive(true)
      }
      setQuestionStartTime(Date.now())
    } else {
      completeQuiz(newScore, newStreak)
    }
  }, [
    selectedAnswer,
    questions,
    currentQuestion,
    score,
    currentStreak,
    settings.soundEnabled,
    settings.timerMode,
    playSound,
    answers,
    completeQuiz,
  ])

  // Generate quiz questions based on settings
  const generateQuiz = useCallback(() => {
    const filteredQuestions = questionBank.filter(
      (q) =>
        settings.categories.includes(q.category) &&
        (settings.difficulty === "mixed" || q.difficulty === settings.difficulty),
    )

    // Shuffle and take required number
    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, settings.questionCount)

    setQuestions(selected)
    setAnswers(new Array(selected.length).fill(null))
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setCurrentStreak(0)
    setShowResult(false)
    setQuizCompleted(false)
    setUsedPowerUps([])

    // Reset timers
    setCurrentQuestionTime(30)
    setTotalTimeRemaining(settings.questionCount * 30)
    setIsTimerActive(settings.timerMode !== "none")
    setTimeUp(false)

    setQuizStartTime(Date.now())
    setQuestionStartTime(Date.now())
  }, [settings])

  // Timer effects
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (
      settings.timerMode === "per-question" &&
      isTimerActive &&
      currentQuestionTime > 0 &&
      !showResult &&
      !quizCompleted
    ) {
      interval = setInterval(() => {
        setCurrentQuestionTime((time) => {
          if (time <= 1) {
            setTimeUp(true)
            setIsTimerActive(false)
            if (settings.soundEnabled) playSound("tick")
            setTimeout(() => handleNext(), 1000)
            return 0
          }
          if (time <= 10 && settings.soundEnabled) playSound("tick")
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    settings.timerMode,
    isTimerActive,
    currentQuestionTime,
    showResult,
    quizCompleted,
    settings.soundEnabled,
    handleNext,
    playSound,
  ])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (settings.timerMode === "total" && isTimerActive && totalTimeRemaining > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTotalTimeRemaining((time) => {
          if (time <= 1) {
            setTimeUp(true)
            setIsTimerActive(false)
            setQuizCompleted(true)
            return 0
          }
          if (time <= 30 && settings.soundEnabled) playSound("tick")
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [settings.timerMode, isTimerActive, totalTimeRemaining, quizCompleted, settings.soundEnabled, playSound])

  // Handle skip power-up
  useEffect(() => {
    if (selectedAnswer === -1 && showResult) {
      // Auto-advance after a short delay for skip
      const timer = setTimeout(() => {
        handleNext()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedAnswer, showResult, handleNext])

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
      setShowResult(false)
    }
  }

  // Handle submit answer
  const handleSubmit = () => {
    setShowResult(true)
  }

  // Reset quiz
  const resetQuiz = () => {
    generateQuiz()
    setCurrentView("quiz")
  }

  // Start new quiz
  const startQuiz = () => {
    generateQuiz()
    setCurrentView("quiz")
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Theme classes
  const getThemeClasses = () => {
    switch (settings.theme) {
      case "dark":
        return "bg-gray-900 text-white min-h-screen"
      case "blue":
        return "bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen"
      case "green":
        return "bg-gradient-to-br from-green-50 to-green-100 min-h-screen"
      default:
        return "bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
    }
  }

  // Quiz completion screen
  if (quizCompleted && currentView === "quiz") {
    const accuracy = questions.length > 0 ? (score / questions.length) * 100 : 0

    return (
      <>
        <div className={getThemeClasses()}>
          <div className="p-4 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-green-600">Quiz Completed!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="text-6xl font-bold text-indigo-600">
                  {score}/{questions.length}
                </div>
                <div className="text-xl text-gray-600">You scored {accuracy.toFixed(1)}%</div>

                {/* XP and Level Up */}
                <div className="space-y-2">
                  <div className="text-lg font-semibold">+{score * 10} XP earned!</div>
                  {currentStreak > 0 && (
                    <div className="text-sm text-orange-600">🔥 {currentStreak} question streak!</div>
                  )}
                </div>

                <div className="flex justify-center">
                  {accuracy === 100 ? (
                    <Badge variant="default" className="text-lg px-4 py-2 bg-green-500">
                      Perfect Score! 🎉
                    </Badge>
                  ) : accuracy >= 70 ? (
                    <Badge variant="default" className="text-lg px-4 py-2 bg-blue-500">
                      Great Job! 👏
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Keep Practicing! 💪
                    </Badge>
                  )}
                </div>

                <div className="flex gap-3 justify-center">
                  <Button onClick={resetQuiz} className="text-lg px-8 py-3">
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Play Again
                  </Button>
                  <Button onClick={() => setCurrentView("home")} variant="outline" className="text-lg px-8 py-3">
                    <Home className="mr-2 h-5 w-5" />
                    Home
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <DeveloperCornerButton onClick={() => setShowDeveloperPopup(true)} />
        <DeveloperCredits showPopup={showDeveloperPopup} onClose={() => setShowDeveloperPopup(false)} />
      </>
    )
  }

  // Main quiz interface
  if (currentView === "quiz" && questions.length > 0) {
    const progress = ((currentQuestion + 1) / questions.length) * 100
    const currentQ = questions[currentQuestion]

    return (
      <>
        <div className={getThemeClasses()}>
          <div className="p-4 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">QuizMaster Pro</h1>
                <div className="flex items-center space-x-4">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  <Badge variant="default" className="text-lg px-3 py-1">
                    Score: {score}
                  </Badge>
                  {currentStreak > 0 && (
                    <Badge variant="default" className="text-lg px-3 py-1 bg-orange-500">
                      🔥 {currentStreak}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Timer */}
              {settings.timerMode !== "none" && (
                <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsTimerActive(!isTimerActive)}
                      disabled={showResult}
                    >
                      {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center space-x-2 text-lg font-bold ${
                        (settings.timerMode === "per-question" ? currentQuestionTime : totalTimeRemaining) <= 10
                          ? "text-red-600"
                          : (settings.timerMode === "per-question" ? currentQuestionTime : totalTimeRemaining) <= 20
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      <Clock className="h-5 w-5" />
                      <span>
                        {formatTime(settings.timerMode === "per-question" ? currentQuestionTime : totalTimeRemaining)}
                      </span>
                    </div>

                    {timeUp && (
                      <Badge variant="destructive" className="animate-pulse">
                        Time's Up!
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Power-ups */}
              <div className="flex gap-2 mb-4">
                {powerUps.map((powerUp) => (
                  <PowerUpButton key={powerUp.id} powerUp={powerUp} />
                ))}
              </div>

              <Progress value={progress} className="h-3" />
            </div>

            {/* Question Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{currentQ.category}</Badge>
                    <Badge
                      variant={
                        currentQ.difficulty === "easy"
                          ? "default"
                          : currentQ.difficulty === "medium"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {currentQ.difficulty}
                    </Badge>
                    <Badge variant="outline">{currentQ.points} pts</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === index
                          ? showResult
                            ? index === currentQ.correctAnswer
                              ? "border-green-500 bg-green-50 text-green-800"
                              : "border-red-500 bg-red-50 text-red-800"
                            : "border-indigo-500 bg-indigo-50 text-indigo-800"
                          : showResult && index === currentQ.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      disabled={showResult}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg">{option}</span>
                        {showResult && (
                          <div>
                            {index === currentQ.correctAnswer ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : selectedAnswer === index ? (
                              <XCircle className="h-6 w-6 text-red-600" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Explanation */}
                {showResult && currentQ.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <div className="font-semibold text-blue-800 mb-1">Explanation:</div>
                    <div className="text-blue-700">{currentQ.explanation}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button onClick={handlePrevious} disabled={currentQuestion === 0} variant="outline" className="px-6 py-3">
                Previous
              </Button>

              <div className="flex space-x-3">
                {!showResult && selectedAnswer !== null && (
                  <Button onClick={handleSubmit} variant="secondary" className="px-6 py-3">
                    Check Answer
                  </Button>
                )}

                {showResult && (
                  <Button onClick={handleNext} className="px-6 py-3">
                    {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                  </Button>
                )}
              </div>
            </div>

            {/* Question dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index)
                    setSelectedAnswer(answers[index])
                    setShowResult(false)
                  }}
                  className={`w-4 h-4 rounded-full transition-all ${
                    index === currentQuestion
                      ? "bg-indigo-600"
                      : answers[index] !== null
                        ? "bg-green-400"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Achievements Modal */}
          <AchievementsModal
            isOpen={showAchievements}
            onClose={() => setShowAchievements(false)}
            newAchievements={newAchievements}
          />
        </div>
        <DeveloperCornerButton onClick={() => setShowDeveloperPopup(true)} />
        <DeveloperCredits showPopup={showDeveloperPopup} onClose={() => setShowDeveloperPopup(false)} />
      </>
    )
  }

  // Home screen with tabs
  return (
    <>
      <div className={getThemeClasses()}>
        <div className="p-4 max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">QuizMaster Pro</h1>
            <p className="text-xl text-gray-600">Test your knowledge across multiple categories</p>
          </div>

          <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Quick Start
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-indigo-600">Level {userStats.level}</div>
                      <div className="text-sm text-gray-600">{userStats.totalXP} XP</div>
                    </div>
                    <Button onClick={startQuiz} className="w-full text-lg py-6">
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Quizzes:</span>
                        <span className="font-semibold">{userStats.totalQuizzes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy:</span>
                        <span className="font-semibold">
                          {userStats.totalQuestions > 0
                            ? ((userStats.correctAnswers / userStats.totalQuestions) * 100).toFixed(1)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Best Streak:</span>
                        <span className="font-semibold">{userStats.bestStreak}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Achievements:</span>
                        <span className="font-semibold">
                          {userStats.achievements.filter((a) => a.unlocked).length}/{userStats.achievements.length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="mt-6">
              <UserStatsComponent stats={userStats} />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <QuizSettingsComponent settings={settings} onSettingsChange={setSettings} onStartQuiz={startQuiz} />
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userStats.achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={achievement.unlocked ? "border-yellow-400 bg-yellow-50" : "opacity-60"}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <div className="font-semibold">{achievement.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{achievement.description}</div>
                      {achievement.unlocked ? (
                        <Badge variant="default" className="bg-yellow-500">
                          Unlocked!
                        </Badge>
                      ) : (
                        <Badge variant="outline">Locked</Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <DeveloperCornerButton onClick={() => setShowDeveloperPopup(true)} />
      <DeveloperCredits showPopup={showDeveloperPopup} onClose={() => setShowDeveloperPopup(false)} />
    </>
  )
}
