"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Code, X } from "lucide-react"

interface DeveloperCreditsProps {
  showPopup?: boolean
  onClose?: () => void
}

export function DeveloperCredits({ showPopup = false, onClose }: DeveloperCreditsProps) {
  const [isOpen, setIsOpen] = useState(showPopup)

  useEffect(() => {
    setIsOpen(showPopup)
  }, [showPopup])

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const developerInfo = {
    name: "ABHINAV TIWARY",
    title: "Engineering Student | Web Dev & AI Enthusiast",
    description: "Building real-world tech solutions",
    linkedin: "https://www.linkedin.com/in/abhinav-tiwary-791a63302/",
    github: "https://github.com/abhiii9vvv",
    image: "/images/abhinav-profile.jpg",
    techStack: ["Python", "JavaScript", "React", "Node.js"],
    projects: ["Weapon Detection System", "Price Tracker Website", "VoiceVerse Assistant"],
  }

  const content = (
    <Card className="w-full max-w-xs mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-indigo-200">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="relative">
            <img
              src={developerInfo.image || "/placeholder.svg"}
              alt="Abhinav Tiwary"
              className="w-16 h-16 rounded-full mx-auto border-3 border-white shadow-lg object-cover"
            />
            <div className="absolute -top-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <Code className="w-2 h-2 text-white" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800">{developerInfo.name}</h3>
            <p className="text-xs text-gray-600 mb-1">{developerInfo.title}</p>
            <p className="text-xs text-gray-500">{developerInfo.description}</p>
          </div>

          <div className="flex flex-wrap gap-1 justify-center">
            {developerInfo.techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs px-2 py-0.5">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(developerInfo.linkedin, "_blank")}
              className="flex items-center gap-1 text-xs px-2 py-1"
            >
              <Linkedin className="w-3 h-3 text-blue-600" />
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(developerInfo.github, "_blank")}
              className="flex items-center gap-1 text-xs px-2 py-1"
            >
              <Github className="w-3 h-3" />
              GitHub
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">🚀 Featured Projects:</p>
            <div className="text-xs text-gray-600 space-y-0.5">
              {developerInfo.projects.map((project) => (
                <div key={project} className="flex items-center justify-center gap-1">
                  <span className="w-1 h-1 bg-indigo-400 rounded-full"></span>
                  {project}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">💡 QuizMaster Pro</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (showPopup) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-sm p-0 bg-transparent border-none shadow-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute -top-2 -right-2 z-10 bg-white rounded-full shadow-md hover:bg-gray-100 w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
            {content}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Only render when popup is requested
  return null
}

export function DeveloperCornerButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={onClick}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg rounded-full px-4 py-2 text-sm font-medium"
      >
        <Code className="w-4 h-4 mr-2" />
        MADE BY ABHINAV
      </Button>
    </div>
  )
}
