import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>()
const WINDOW_SIZE = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute

export const config = {
  matcher: '/api/:path*',
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://odia.dev')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers: response.headers })
  }

  // Basic rate limiting
  const ip = request.ip || 'unknown'
  const now = Date.now()
  const windowStart = now - WINDOW_SIZE

  // Clean up old entries
  for (const [key, data] of rateLimit.entries()) {
    if (data.timestamp < windowStart) {
      rateLimit.delete(key)
    }
  }

  // Check rate limit
  const currentLimit = rateLimit.get(ip)
  if (currentLimit) {
    if (currentLimit.timestamp < windowStart) {
      // Reset if window has passed
      rateLimit.set(ip, { count: 1, timestamp: now })
    } else if (currentLimit.count >= MAX_REQUESTS) {
      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...Object.fromEntries(response.headers),
          },
        }
      )
    } else {
      // Increment counter
      currentLimit.count++
    }
  } else {
    // First request in window
    rateLimit.set(ip, { count: 1, timestamp: now })
  }

  return response
}
