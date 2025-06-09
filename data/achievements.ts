import type { Achievement } from "../types/quiz"

export const achievementTemplates: Omit<Achievement, "unlocked" | "unlockedAt">[] = [
  {
    id: "first-quiz",
    name: "Getting Started",
    description: "Complete your first quiz",
    icon: "🎯",
  },
  {
    id: "perfect-score",
    name: "Perfectionist",
    description: "Get 100% on a quiz",
    icon: "🏆",
  },
  {
    id: "speed-demon",
    name: "Speed Demon",
    description: "Complete a quiz in under 2 minutes",
    icon: "⚡",
  },
  {
    id: "streak-5",
    name: "On Fire",
    description: "Get 5 questions correct in a row",
    icon: "🔥",
  },
  {
    id: "streak-10",
    name: "Unstoppable",
    description: "Get 10 questions correct in a row",
    icon: "🚀",
  },
  {
    id: "category-master-science",
    name: "Science Master",
    description: "Answer 20 science questions correctly",
    icon: "🧪",
  },
  {
    id: "category-master-math",
    name: "Math Wizard",
    description: "Answer 20 math questions correctly",
    icon: "🔢",
  },
  {
    id: "level-5",
    name: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
  },
  {
    id: "level-10",
    name: "Quiz Master",
    description: "Reach level 10",
    icon: "👑",
  },
  {
    id: "hundred-questions",
    name: "Century Club",
    description: "Answer 100 questions",
    icon: "💯",
  },
]
