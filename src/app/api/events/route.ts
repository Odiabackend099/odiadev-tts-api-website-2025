import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

// Event type validation schema
const eventTypes = z.enum(['lead', 'intake', 'conversation_end', 'error'])

// Base event schema
const baseEventSchema = z.object({
  type: eventTypes,
  session_id: z.string().optional(),
})

// Lead event schema
const leadEventSchema = baseEventSchema.extend({
  type: z.literal('lead'),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

// Intake event schema
const intakeEventSchema = baseEventSchema.extend({
  type: z.literal('intake'),
  business_name: z.string(),
  industry: z.string(),
  country: z.string(),
  preferred_channels: z.array(z.string()),
  whatsapp_number: z.string().optional(),
  telegram_handle: z.string().optional(),
  website_url: z.string().optional(),
  use_cases: z.array(z.string()),
  required_integrations: z.array(z.string()),
  budget_tier: z.string(),
  timeline: z.string(),
  voice_pref: z.record(z.unknown()),
  contact: z.record(z.unknown()),
})

// Conversation end event schema
const conversationEndEventSchema = baseEventSchema.extend({
  type: z.literal('conversation_end'),
  transcript: z.string(),
  final_reply: z.string(),
})

// Error event schema
const errorEventSchema = baseEventSchema.extend({
  type: z.literal('error'),
  message: z.string(),
})

// Combined event schema
const eventSchema = z.discriminatedUnion('type', [
  leadEventSchema,
  intakeEventSchema,
  conversationEndEventSchema,
  errorEventSchema,
])

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
    
    // Validate event data
    const event = eventSchema.parse(body)

    // Forward to n8n webhook
    const n8nResponse = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook error: ${n8nResponse.statusText}`)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Event processing error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid event data', details: error.format() },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
