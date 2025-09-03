import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatBubbleLeftIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useVoiceStore, useChatStore } from '../../store'
import { VoiceToggle } from './VoiceToggle'
import { AvatarPicker } from './AvatarPicker'
import { MessageList } from './MessageList'

export const FloatingChatWidget = () => {
  const {
    isVoiceEnabled,
    isMicEnabled,
    selectedVoice,
    sessionId,
    setVoiceEnabled,
    setMicEnabled,
    setSelectedVoice,
    setSessionId,
  } = useVoiceStore()

  const { isOpen, messages, setOpen, addMessage } = useChatStore()
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Initialize session ID from localStorage or create new one
    const savedSessionId = localStorage.getItem('odiadev_session_id')
    if (savedSessionId) {
      setSessionId(savedSessionId)
    } else {
      const newSessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`
      setSessionId(newSessionId)
      localStorage.setItem('odiadev_session_id', newSessionId)
    }
  }, [setSessionId])

  const handleSendMessage = async (text: string) => {
    // Add user message
    addMessage({ role: 'user', content: text })

    try {
      // TODO: Send to backend and get response
      const response = "I'm here to help you with ODIADEV's voice AI solutions."
      
      // Add assistant message
      addMessage({ role: 'assistant', content: response })

      // Play TTS if voice enabled
      if (isVoiceEnabled) {
        try {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: response, voice_id: selectedVoice }),
          })

          if (res.ok) {
            const audioBlob = await res.blob()
            const audioUrl = URL.createObjectURL(audioBlob)
            if (audioRef.current) {
              audioRef.current.src = audioUrl
              await audioRef.current.play()
            }
          }
        } catch (error) {
          console.error('TTS error:', error)
        }
      }
    } catch (error) {
      console.error('Chat error:', error)
      addMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      })
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50 p-4 bg-navy text-white rounded-full shadow-lg hover:bg-navy-700 transition-colors border border-gold/30 hover:border-gold"
        onClick={() => setOpen(true)}
      >
        <ChatBubbleLeftIcon className="w-6 h-6" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 z-50 w-96 h-[600px] bg-navy-900 rounded-lg shadow-xl border border-gold/20 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gold/10">
              <h3 className="font-serif text-lg text-gold-soft">ODIADEV Assistant</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-navy-700 rounded-md text-stone hover:text-gold-soft transition-colors"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-navy-700 rounded-md text-stone hover:text-gold-soft transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {showSettings ? (
              <div className="flex-1 overflow-hidden">
                <div className="p-4">
                  <h4 className="text-gold-soft font-medium mb-4">Voice Settings</h4>
                  <VoiceToggle
                    isVoiceEnabled={isVoiceEnabled}
                    isMicEnabled={isMicEnabled}
                    onVoiceToggle={() => setVoiceEnabled(!isVoiceEnabled)}
                    onMicToggle={() => setMicEnabled(!isMicEnabled)}
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-gold-soft font-medium mb-4">Select Voice</h4>
                  <AvatarPicker
                    selectedVoice={selectedVoice}
                    onSelect={setSelectedVoice}
                  />
                </div>
              </div>
            ) : (
              <>
                {/* Message List */}
                <MessageList messages={messages} />

                {/* Input */}
                <div className="p-4 border-t border-gold/10">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      const input = e.currentTarget.elements.namedItem(
                        'message'
                      ) as HTMLInputElement
                      if (input.value.trim()) {
                        handleSendMessage(input.value.trim())
                        input.value = ''
                      }
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      name="message"
                      placeholder="Type your message..."
                      className="flex-1 bg-navy-700 text-white placeholder-stone rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                    <button
                      type="submit"
                      className="btn btn-primary py-2 px-4"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden audio element for TTS playback */}
      <audio ref={audioRef} className="hidden" />
    </>
  )
}
