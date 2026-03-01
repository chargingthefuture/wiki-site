import { NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/db"

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
