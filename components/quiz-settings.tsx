"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { QuizSettings } from "../types/quiz"
import { categories } from "../data/questions"
import { Settings, Palette, Volume2, Timer, Target, Hash } from "lucide-react"

interface QuizSettingsProps {
  settings: QuizSettings
  onSettingsChange: (settings: QuizSettings) => void
  onStartQuiz: () => void
}

export function QuizSettingsComponent({ settings, onSettingsChange, onStartQuiz }: QuizSettingsProps) {
  const themes = [
    { value: "light", label: "Light", colors: "bg-white text-gray-900" },
    { value: "dark", label: "Dark", colors: "bg-gray-900 text-white" },
    { value: "blue", label: "Ocean Blue", colors: "bg-blue-50 text-blue-900" },
    { value: "green", label: "Forest Green", colors: "bg-green-50 text-green-900" },
  ]

  const updateSettings = (key: keyof QuizSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  const toggleCategory = (category: string) => {
    const newCategories = settings.categories.includes(category)
      ? settings.categories.filter((c) => c !== category)
      : [...settings.categories, category]
    updateSettings("categories", newCategories)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme & Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => updateSettings("theme", theme.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  settings.theme === theme.value
                    ? "border-indigo-500 ring-2 ring-indigo-200"
                    : "border-gray-200 hover:border-gray-300"
                } ${theme.colors}`}
              >
                <div className="text-sm font-medium">{theme.label}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quiz Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              <Label htmlFor="sound">Sound Effects</Label>
            </div>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings("soundEnabled", checked)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <Label>Timer Mode</Label>
            </div>
            <Select value={settings.timerMode} onValueChange={(value) => updateSettings("timerMode", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="per-question">Per Question (30s)</SelectItem>
                <SelectItem value="total">Total Quiz (5min)</SelectItem>
                <SelectItem value="none">No Timer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <Label>Difficulty</Label>
            </div>
            <Select value={settings.difficulty} onValueChange={(value) => updateSettings("difficulty", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed Difficulty</SelectItem>
                <SelectItem value="easy">Easy Only</SelectItem>
                <SelectItem value="medium">Medium Only</SelectItem>
                <SelectItem value="hard">Hard Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <Label>Number of Questions</Label>
            </div>
            <Select
              value={settings.questionCount.toString()}
              onValueChange={(value) => updateSettings("questionCount", Number.parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={settings.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer px-3 py-1"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {settings.categories.length === 0
              ? "Select at least one category"
              : `${settings.categories.length} categories selected`}
          </p>
        </CardContent>
      </Card>

      <Button onClick={onStartQuiz} className="w-full text-lg py-6" disabled={settings.categories.length === 0}>
        Start Quiz
      </Button>
    </div>
  )
}
