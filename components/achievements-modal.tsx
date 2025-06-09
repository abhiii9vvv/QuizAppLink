import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Achievement } from "../types/quiz"

interface AchievementsModalProps {
  isOpen: boolean
  onClose: () => void
  newAchievements: Achievement[]
}

export function AchievementsModal({ isOpen, onClose, newAchievements }: AchievementsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">🎉 Achievement Unlocked!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {newAchievements.map((achievement) => (
            <div key={achievement.id} className="text-center space-y-2">
              <div className="text-6xl">{achievement.icon}</div>
              <div className="text-xl font-bold">{achievement.name}</div>
              <div className="text-gray-600">{achievement.description}</div>
              <Badge variant="default" className="bg-yellow-500">
                New Achievement!
              </Badge>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
