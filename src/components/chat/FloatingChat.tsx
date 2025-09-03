import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoiceStore, useChatStore } from '../../store'
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'

export const FloatingChat = () => {
  const { isOpen, setOpen } = useChatStore()
  const { isVoiceEnabled, sessionId, setSessionId } = useVoiceStore()
  const [isInitialized, setInitialized] = useState(false)

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
    setInitialized(true)
  }, [])

  if (!isInitialized) return null

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50 p-4 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
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
            className="fixed bottom-20 right-4 z-50 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">ODIADEV Assistant</h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Chat messages will go here */}
            </div>

            {/* Input area */}
            <div className="p-4 border-t">
              {/* Voice controls and input will go here */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
