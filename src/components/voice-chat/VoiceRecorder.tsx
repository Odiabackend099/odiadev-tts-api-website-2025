import { useState, useRef, useCallback, useEffect } from 'react'
import { SpeechConfig, AudioConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk'

interface VoiceRecorderProps {
  onTranscription: (text: string) => void
  onRecordingStart: () => void
  onRecordingStop: (audioBlob: Blob) => void
  isListening: boolean
}

export function VoiceRecorder({ 
  onTranscription, 
  onRecordingStart, 
  onRecordingStop,
  isListening 
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recognizerRef = useRef<SpeechRecognizer | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Initialize speech services
  useEffect(() => {
    const speechConfig = SpeechConfig.fromSubscription(
      import.meta.env.VITE_AZURE_SPEECH_KEY,
      import.meta.env.VITE_AZURE_SPEECH_REGION
    )
    speechConfig.speechRecognitionLanguage = 'en-US'

    return () => {
      recognizerRef.current?.close()
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      // Setup MediaRecorder for audio capture
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' })
        onRecordingStop(audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      // Setup real-time speech recognition
      const audioConfig = AudioConfig.fromStreamInput(stream)
      const recognizer = new SpeechRecognizer(
        speechConfig,
        audioConfig
      )
      recognizerRef.current = recognizer

      recognizer.recognized = (s, e) => {
        if (e.result.text) {
          onTranscription(e.result.text)
        }
      }

      // Start recording and recognition
      mediaRecorder.start()
      recognizer.startContinuousRecognitionAsync()
      setIsRecording(true)
      onRecordingStart()
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }, [onRecordingStart, onRecordingStop, onTranscription])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
      recognizerRef.current?.stopContinuousRecognitionAsync()
      setIsRecording(false)
    }
  }, [])

  // Handle external listening state
  useEffect(() => {
    if (isListening && !isRecording) {
      startRecording()
    } else if (!isListening && isRecording) {
      stopRecording()
    }
  }, [isListening, isRecording, startRecording, stopRecording])

  return (
    <div className="relative">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-navy-600 hover:bg-navy-700'
        }`}
        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      >
        {isRecording ? (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="6" width="12" height="12" />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        )}
      </button>
      
      {isRecording && (
        <div className="absolute -top-2 -right-2">
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}
    </div>
  )
}
