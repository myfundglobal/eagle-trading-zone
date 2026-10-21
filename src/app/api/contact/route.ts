import { NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = contactSchema.parse(body)

    // Log ticket or save to DB if Supabase configured
    console.log('[Contact Ticket Received]:', parsed)

    return NextResponse.json({ success: true, message: 'Ticket received' })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Invalid form data' },
      { status: 400 }
    )
  }
}
