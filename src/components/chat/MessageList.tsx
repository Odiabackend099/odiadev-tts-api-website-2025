import { motion } from 'framer-motion'
import { format } from 'date-fns'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface MessageListProps {
  messages: Message[]
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user'
                ? 'bg-gold text-navy-900'
                : 'bg-navy-700 text-white'
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <div
              className={`mt-1 text-xs ${
                message.role === 'user' ? 'text-navy-700' : 'text-stone'
              }`}
            >
              {format(message.timestamp, 'HH:mm')}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
