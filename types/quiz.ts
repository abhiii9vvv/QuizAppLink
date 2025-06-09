export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  category: string
  difficulty: "easy" | "medium" | "hard"
  type: "multiple-choice" | "true-false" | "fill-blank"
  explanation?: string
  points: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: Date
}

export interface UserStats {
  totalQuizzes: number
  totalQuestions: number
  correctAnswers: number
  streak: number
  bestStreak: number
  totalXP: number
  level: number
  averageTime: number
  categoryStats: Record<string, { correct: number; total: number }>
  achievements: Achievement[]
}

export interface PowerUp {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  uses: number
}

export interface QuizSettings {
  theme: "light" | "dark" | "blue" | "green"
  soundEnabled: boolean
  timerMode: "per-question" | "total" | "none"
  difficulty: "mixed" | "easy" | "medium" | "hard"
  categories: string[]
  questionCount: number
}
