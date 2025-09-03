import { motion } from 'framer-motion'

const avatars = [
  {
    id: 'naija_female_warm',
    name: 'Amara',
    description: 'Warm Nigerian Female',
    image: '/assets/avatars/naija-female.jpg', // Placeholder
  },
  {
    id: 'naija_male_clear',
    name: 'Chisom',
    description: 'Clear Nigerian Male',
    image: '/assets/avatars/naija-male.jpg', // Placeholder
  },
  {
    id: 'us_female_crisp',
    name: 'Sarah',
    description: 'Crisp American Female',
    image: '/assets/avatars/us-female.jpg', // Placeholder
  },
  {
    id: 'us_male_calm',
    name: 'James',
    description: 'Calm American Male',
    image: '/assets/avatars/us-male.jpg', // Placeholder
  },
]

interface AvatarPickerProps {
  selectedVoice: string
  onSelect: (voiceId: string) => void
}

export const AvatarPicker = ({ selectedVoice, onSelect }: AvatarPickerProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {avatars.map((avatar) => (
        <motion.button
          key={avatar.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(avatar.id)}
          className={`relative group rounded-lg overflow-hidden ${
            selectedVoice === avatar.id
              ? 'ring-2 ring-gold ring-offset-2 ring-offset-navy-900'
              : ''
          }`}
        >
          {/* Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-navy-700">
            <img
              src={avatar.image}
              alt={avatar.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-overlay opacity-40 group-hover:opacity-30 transition-opacity" />
          </div>

          {/* Info */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy-900 to-transparent">
            <h4 className="text-white font-medium text-sm">{avatar.name}</h4>
            <p className="text-stone text-xs">{avatar.description}</p>
          </div>

          {/* Selected indicator */}
          {selectedVoice === avatar.id && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold text-navy-900 flex items-center justify-center">
              <span className="text-sm">✓</span>
            </div>
          )}
        </motion.button>
      ))}
    </div>
  )
}
