import { useState, useRef, useEffect } from 'react'
import {
  SpeechConfig,
  AudioConfig,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'

interface TTSPlayerProps {
  text: string
  onPlayStart: () => void
  onPlayEnd: () => void
  voice?: string // Azure voice name
}

export function TTSPlayer({ 
  text, 
  onPlayStart, 
  onPlayEnd, 
  voice = 'en-US-JennyNeural' 
}: TTSPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const synthesizer = useRef<SpeechSynthesizer | null>(null)
  const audioPlayer = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize speech synthesizer
    const speechConfig = SpeechConfig.fromSubscription(
      import.meta.env.VITE_AZURE_SPEECH_KEY,
      import.meta.env.VITE_AZURE_SPEECH_REGION
    )
    speechConfig.speechSynthesisVoiceName = voice

    // Use audio element for better control
    audioPlayer.current = new Audio()
    const audioConfig = AudioConfig.fromAudioElement(audioPlayer.current)

    synthesizer.current = new SpeechSynthesizer(speechConfig, audioConfig)

    return () => {
      synthesizer.current?.close()
    }
  }, [voice])

  useEffect(() => {
    if (!audioPlayer.current) return

    const player = audioPlayer.current

    const handlePlay = () => {
      setIsPlaying(true)
      onPlayStart()
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setIsLoading(false)
      onPlayEnd()
    }

    player.addEventListener('play', handlePlay)
    player.addEventListener('ended', handleEnded)

    return () => {
      player.removeEventListener('play', handlePlay)
      player.removeEventListener('ended', handleEnded)
    }
  }, [onPlayStart, onPlayEnd])

  const playTTS = async () => {
    if (!synthesizer.current || !text.trim()) return

    try {
      setIsLoading(true)
      const result = await synthesizer.current.speakTextAsync(text)
      
      if (result) {
        // Handle successful synthesis
        setIsLoading(false)
        if (audioPlayer.current) {
          audioPlayer.current.play()
        }
      }
    } catch (error) {
      console.error('TTS Error:', error)
      setIsLoading(false)
    }
  }

  const stopTTS = () => {
    if (audioPlayer.current) {
      audioPlayer.current.pause()
      audioPlayer.current.currentTime = 0
    }
    setIsPlaying(false)
    onPlayEnd()
  }

  return (
    <button
      onClick={isPlaying ? stopTTS : playTTS}
      disabled={isLoading || !text}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        isPlaying 
          ? 'bg-red-500 hover:bg-red-600' 
          : text 
            ? 'bg-navy-600 hover:bg-navy-700'
            : 'bg-navy-300 cursor-not-allowed'
      }`}
      aria-label={isPlaying ? 'Stop playback' : 'Play text'}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <rect x="6" y="6" width="12" height="12" />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
    </button>
  )
}
