
import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { pool } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      firstName,
      lastName,
      email,
      skills,
      country,
      state,
      city,
      quoraUrl,
    } = data

    // Basic validation (server-side)
    if (!firstName || !lastName || !email || !skills || !country || !quoraUrl) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
    }
    if (skills.length > 240) {
      return NextResponse.json({ error: "Skills must be 240 characters or less." }, { status: 400 })
    }

    const query = `
      INSERT INTO waitlist_signups
        (first_name, last_name, email, skills, country, state, city, quora_profile_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at
    `
    const values = [firstName, lastName, email, skills, country, state, city, quoraUrl]
    const result = await pool.query(query, values)

    return NextResponse.json({ success: true, id: result.rows[0].id, created_at: result.rows[0].created_at })
  } catch (err: any) {
    Sentry.captureException(err)
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 })
  }
}
