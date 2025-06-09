"use client"

import { useCallback } from "react"

export function useSound() {
  const playSound = useCallback((type: "correct" | "incorrect" | "complete" | "achievement" | "tick") => {
    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    const playTone = (frequency: number, duration: number, type: OscillatorType = "sine") => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      oscillator.type = type

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }

    switch (type) {
      case "correct":
        playTone(523, 0.2) // C5
        setTimeout(() => playTone(659, 0.2), 100) // E5
        break
      case "incorrect":
        playTone(220, 0.3, "sawtooth") // A3
        break
      case "complete":
        playTone(523, 0.15) // C5
        setTimeout(() => playTone(659, 0.15), 100) // E5
        setTimeout(() => playTone(784, 0.3), 200) // G5
        break
      case "achievement":
        playTone(440, 0.1) // A4
        setTimeout(() => playTone(554, 0.1), 100) // C#5
        setTimeout(() => playTone(659, 0.1), 200) // E5
        setTimeout(() => playTone(880, 0.3), 300) // A5
        break
      case "tick":
        playTone(800, 0.05, "square")
        break
    }
  }, [])

  return { playSound }
}
