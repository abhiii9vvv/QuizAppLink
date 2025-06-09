"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RotateCcw, Clock, Pause, Play } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

const quizData: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is 15 + 27?",
    options: ["41", "42", "43", "44"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
  },
]

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(quizData.length).fill(null))

  const [timePerQuestion] = useState(30) // 30 seconds per question
  const [totalQuizTime] = useState(300) // 5 minutes total
  const [currentQuestionTime, setCurrentQuestionTime] = useState(30)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(300)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [timerMode, setTimerMode] = useState<"per-question" | "total">("per-question")
  const [timeUp, setTimeUp] = useState(false)

  // Timer for per-question mode
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerMode === "per-question" && isTimerActive && currentQuestionTime > 0 && !showResult && !quizCompleted) {
      interval = setInterval(() => {
        setCurrentQuestionTime((time) => {
          if (time <= 1) {
            setTimeUp(true)
            setIsTimerActive(false)
            // Auto-submit when time runs out
            setTimeout(() => {
              handleNext()
            }, 1000)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerMode, isTimerActive, currentQuestionTime, showResult, quizCompleted])

  // Timer for total quiz mode
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (timerMode === "total" && isTimerActive && totalTimeRemaining > 0 && !quizCompleted) {
      interval = setInterval(() => {
        setTotalTimeRemaining((time) => {
          if (time <= 1) {
            setTimeUp(true)
            setIsTimerActive(false)
            setQuizCompleted(true)
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerMode, isTimerActive, totalTimeRemaining, quizCompleted])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === quizData[currentQuestion].correctAnswer) {
        setScore(score + 1)
      }
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
      setShowResult(false)
      // Reset question timer
      if (timerMode === "per-question") {
        setCurrentQuestionTime(timePerQuestion)
        setTimeUp(false)
        setIsTimerActive(true)
      }
    } else {
      setQuizCompleted(true)
      setIsTimerActive(false)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
      setShowResult(false)
      // Reset question timer
      if (timerMode === "per-question") {
        setCurrentQuestionTime(timePerQuestion)
        setTimeUp(false)
        setIsTimerActive(true)
      }
    }
  }

  const handleSubmit = () => {
    setShowResult(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setQuizCompleted(false)
    setAnswers(new Array(quizData.length).fill(null))
    setCurrentQuestionTime(timePerQuestion)
    setTotalTimeRemaining(totalQuizTime)
    setIsTimerActive(true)
    setTimeUp(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const toggleTimer = () => {
    setIsTimerActive(!isTimerActive)
  }

  const switchTimerMode = (mode: "per-question" | "total") => {
    setTimerMode(mode)
    if (mode === "per-question") {
      setCurrentQuestionTime(timePerQuestion)
      setIsTimerActive(true)
    } else {
      setTotalTimeRemaining(totalQuizTime)
      setIsTimerActive(true)
    }
    setTimeUp(false)
  }

  const progress = ((currentQuestion + 1) / quizData.length) * 100

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-green-600">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-indigo-600">
              {score}/{quizData.length}
            </div>
            <div className="text-xl text-gray-600">You scored {Math.round((score / quizData.length) * 100)}%</div>
            <div className="flex justify-center">
              {score === quizData.length ? (
                <Badge variant="default" className="text-lg px-4 py-2 bg-green-500">
                  Perfect Score! 🎉
                </Badge>
              ) : score >= quizData.length * 0.7 ? (
                <Badge variant="default" className="text-lg px-4 py-2 bg-blue-500">
                  Great Job! 👏
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  Keep Practicing! 💪
                </Badge>
              )}
            </div>
            <Button onClick={resetQuiz} className="text-lg px-8 py-3">
              <RotateCcw className="mr-2 h-5 w-5" />
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Counter and Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Interactive Quiz</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-lg px-3 py-1">
                Question {currentQuestion + 1} of {quizData.length}
              </Badge>
              <Badge variant="default" className="text-lg px-3 py-1">
                Score: {score}
              </Badge>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-sm border">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={timerMode === "per-question" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchTimerMode("per-question")}
                  disabled={showResult}
                >
                  Per Question
                </Button>
                <Button
                  variant={timerMode === "total" ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchTimerMode("total")}
                  disabled={showResult}
                >
                  Total Quiz
                </Button>
              </div>

              <Button variant="outline" size="sm" onClick={toggleTimer} disabled={showResult || quizCompleted}>
                {isTimerActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              {timerMode === "per-question" ? (
                <div
                  className={`flex items-center space-x-2 text-lg font-bold ${
                    currentQuestionTime <= 10
                      ? "text-red-600"
                      : currentQuestionTime <= 20
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  <Clock className="h-5 w-5" />
                  <span>{formatTime(currentQuestionTime)}</span>
                </div>
              ) : (
                <div
                  className={`flex items-center space-x-2 text-lg font-bold ${
                    totalTimeRemaining <= 60
                      ? "text-red-600"
                      : totalTimeRemaining <= 120
                        ? "text-orange-600"
                        : "text-green-600"
                  }`}
                >
                  <Clock className="h-5 w-5" />
                  <span>{formatTime(totalTimeRemaining)}</span>
                </div>
              )}

              {timeUp && (
                <Badge variant="destructive" className="animate-pulse">
                  Time's Up!
                </Badge>
              )}
            </div>
          </div>

          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{quizData[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quizData[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showResult
                        ? index === quizData[currentQuestion].correctAnswer
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-red-500 bg-red-50 text-red-800"
                        : "border-indigo-500 bg-indigo-50 text-indigo-800"
                      : showResult && index === quizData[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 text-green-800"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option}</span>
                    {showResult && (
                      <div>
                        {index === quizData[currentQuestion].correctAnswer ? (
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
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
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
                {currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {quizData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestion(index)
                setSelectedAnswer(answers[index])
                setShowResult(false)
              }}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                index === currentQuestion ? "bg-indigo-600" : answers[index] !== null ? "bg-green-400" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
