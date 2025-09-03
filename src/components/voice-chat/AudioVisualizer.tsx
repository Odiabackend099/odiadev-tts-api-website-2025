import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

interface AudioVisualizerProps {
  stream: MediaStream | null
  isRecording: boolean
}

export function AudioVisualizer({ stream, isRecording }: AudioVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<WaveSurfer | null>(null)
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#1a365d', // navy-800
      progressColor: '#4299e1', // blue-500
      cursorColor: 'transparent',
      barWidth: 2,
      barGap: 1,
      height: 32,
      interact: false,
    })

    wavesurferRef.current = wavesurfer

    return () => {
      wavesurfer.destroy()
    }
  }, [])

  useEffect(() => {
    if (!stream || !wavesurferRef.current) return

    const audioContext = new AudioContext()
    const mediaStreamSource = audioContext.createMediaStreamSource(stream)
    const analyser = audioContext.createAnalyser()
    
    mediaStreamSource.connect(analyser)
    mediaStreamSourceRef.current = mediaStreamSource
    analyserRef.current = analyser

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      if (!isRecording) return
      analyser.getByteTimeDomainData(dataArray)
      
      // Convert audio data to waveform points
      const points = Array.from(dataArray).map((value, i) => ({
        x: (i / bufferLength) * 2000,
        y: (value / 128.0) * 50
      }))

      // Update waveform
      wavesurferRef.current?.loadDecodedBuffer(points as any)
      animationFrameRef.current = requestAnimationFrame(draw)
    }

    if (isRecording) {
      draw()
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      mediaStreamSource.disconnect()
      audioContext.close()
    }
  }, [stream, isRecording])

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-8 rounded-lg overflow-hidden transition-opacity duration-200 ${
        isRecording ? 'opacity-100' : 'opacity-0'
      }`}
    />
  )
}
