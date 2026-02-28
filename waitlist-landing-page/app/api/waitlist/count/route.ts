import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const revalidate = 3600 // Revalidate every hour

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query("SELECT COUNT(*) FROM waitlist_signups")
    const count = parseInt(result.rows[0].count, 10)
    return NextResponse.json({ count })
  } catch {
    return NextResponse.json({ count: null }, { status: 500 })
  }
}
