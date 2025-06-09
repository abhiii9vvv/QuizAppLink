import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { UserStats } from "../types/quiz"
import { Trophy, Target, Zap, TrendingUp, Award, Star } from "lucide-react"

interface UserStatsProps {
  stats: UserStats
}

export function UserStatsComponent({ stats }: UserStatsProps) {
  const accuracy = stats.totalQuestions > 0 ? (stats.correctAnswers / stats.totalQuestions) * 100 : 0
  const xpForNextLevel = (stats.level + 1) * 100
  const currentLevelXP = stats.totalXP - stats.level * 100
  const progressToNextLevel = (currentLevelXP / 100) * 100

  const recentAchievements = stats.achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Level and XP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Level {stats.level}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentLevelXP} XP</span>
              <span>{xpForNextLevel} XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
            <p className="text-sm text-gray-600">
              {100 - currentLevelXP} XP until level {stats.level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
            <div className="text-sm text-gray-600">Quizzes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{accuracy.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{stats.bestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.totalXP}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.categoryStats).map(([category, data]) => {
              const categoryAccuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0
              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category}</span>
                    <span>
                      {categoryAccuracy.toFixed(1)}% ({data.correct}/{data.total})
                    </span>
                  </div>
                  <Progress value={categoryAccuracy} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div>
                    <div className="font-medium">{achievement.name}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
