import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

// Input validation schema
const qualifyRequestSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  session_id: z.string(),
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
    const data = qualifyRequestSchema.parse(body)

    // Call Brain API for qualification
    const brainResponse = await fetch(`${process.env.BRAIN_BASE_URL}/api/qualify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.BRAIN_API_KEY && {
          'Authorization': `Bearer ${process.env.BRAIN_API_KEY}`,
        }),
      },
      body: JSON.stringify(data),
    })

    if (!brainResponse.ok) {
      throw new Error(`Brain API error: ${brainResponse.statusText}`)
    }

    const result = await brainResponse.json()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Qualification error:', error)
    
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
