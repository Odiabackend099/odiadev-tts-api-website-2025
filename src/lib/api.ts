import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const ttsApi = {
  synthesizeSpeech: async (text: string, voiceId: string) => {
    const response = await api.post('/tts', { text, voice_id: voiceId });
    return response.data;
  },
};

export const brainApi = {
  qualifyLead: async (data: {
    name: string;
    email: string;
    phone?: string;
    message?: string;
    source?: string;
    session_id: string;
  }) => {
    const response = await api.post('/brain/qualify', data);
    return response.data;
  },

  summarizeConversation: async (transcript: string) => {
    const response = await api.post('/brain/summarize', { transcript });
    return response.data;
  },
};

export const eventApi = {
  trackEvent: async (type: 'lead' | 'intake' | 'conversation_end' | 'error', payload: any) => {
    const response = await api.post('/events', { type, ...payload });
    return response.data;
  },
};
