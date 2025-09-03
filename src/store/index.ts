import { create } from 'zustand'

interface VoiceState {
  isVoiceEnabled: boolean
  isMicEnabled: boolean
  selectedVoice: string
  sessionId: string
  setVoiceEnabled: (enabled: boolean) => void
  setMicEnabled: (enabled: boolean) => void
  setSelectedVoice: (voiceId: string) => void
  setSessionId: (id: string) => void
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isVoiceEnabled: false,
  isMicEnabled: false,
  selectedVoice: 'naija_female_warm',
  sessionId: '',
  setVoiceEnabled: (enabled) => set({ isVoiceEnabled: enabled }),
  setMicEnabled: (enabled) => set({ isMicEnabled: enabled }),
  setSelectedVoice: (voiceId) => set({ selectedVoice: voiceId }),
  setSessionId: (id) => set({ sessionId: id }),
}))

interface ChatState {
  isOpen: boolean
  messages: Array<{
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
  }>
  setOpen: (open: boolean) => void
  addMessage: (message: { role: 'user' | 'assistant'; content: string }) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  setOpen: (open) => set({ isOpen: open }),
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Math.random().toString(36).substring(7),
          ...message,
          timestamp: Date.now(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),
}))
