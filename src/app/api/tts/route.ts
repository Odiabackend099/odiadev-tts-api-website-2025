import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

// Input validation schema
const ttsRequestSchema = z.object({
  text: z.string().min(1).max(1000),
  voice_id: z.string(),
})

export const config = {
  runtime: 'edge',
}

export default async function handler(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    )
  }

  try {
    const body = await req.json()
    
    // Validate input
    const { text, voice_id } = ttsRequestSchema.parse(body)

    // Call ODIADEV TTS API
    const ttsResponse = await fetch(`${process.env.ODIADEV_TTS_URL}/v1/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ODIADEV_TTS_API_KEY}`,
      },
      body: JSON.stringify({ text, voice_id }),
    })

    if (!ttsResponse.ok) {
      throw new Error(`TTS API error: ${ttsResponse.statusText}`)
    }

    // Get audio data and forward it
    const audioBuffer = await ttsResponse.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mp3',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('TTS error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
