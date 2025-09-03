import { motion } from 'framer-motion'
import { MicrophoneIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid'

interface VoiceToggleProps {
  isVoiceEnabled: boolean
  isMicEnabled: boolean
  onVoiceToggle: () => void
  onMicToggle: () => void
}

export const VoiceToggle = ({
  isVoiceEnabled,
  isMicEnabled,
  onVoiceToggle,
  onMicToggle,
}: VoiceToggleProps) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-navy-700/50 rounded-lg">
      {/* Speaker toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onVoiceToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isVoiceEnabled
            ? 'bg-gold/20 text-gold'
            : 'text-stone hover:text-gold-soft'
        }`}
      >
        <SpeakerWaveIcon className="w-5 h-5" />
        <span className="text-sm font-medium">
          {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
        </span>
      </motion.button>

      {/* Mic toggle */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onMicToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
          isMicEnabled ? 'bg-gold/20 text-gold' : 'text-stone hover:text-gold-soft'
        }`}
      >
        <MicrophoneIcon className="w-5 h-5" />
        <span className="text-sm font-medium">
          {isMicEnabled ? 'Mic On' : 'Mic Off'}
        </span>
      </motion.button>
    </div>
  )
}
