/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY: string
  readonly VITE_N8N_WEBHOOK_URL: string
  readonly VITE_ODIADEV_TTS_URL: string
  readonly VITE_ODIADEV_TTS_API_KEY: string
  readonly VITE_BRAIN_BASE_URL: string
  readonly VITE_BRAIN_API_KEY?: string
  readonly VITE_CORS_ORIGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
