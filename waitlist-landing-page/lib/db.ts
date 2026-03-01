import { Pool, type PoolConfig } from "pg"

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"])

function normalizeConnectionString(connectionString: string): string {
  try {
    const url = new URL(connectionString)
    url.searchParams.delete("sslmode")
    return url.toString()
  } catch {
    return connectionString
  }
}

function shouldUseSsl(connectionString: string): boolean {
  try {
    const url = new URL(connectionString)
    return !LOCAL_HOSTS.has(url.hostname)
  } catch {
    return process.env.NODE_ENV === "production"
  }
}

const rawConnectionString = process.env.DATABASE_URL

const poolConfig: PoolConfig = {
  connectionString: rawConnectionString
    ? normalizeConnectionString(rawConnectionString)
    : undefined,
}

if (rawConnectionString && shouldUseSsl(rawConnectionString)) {
  poolConfig.ssl = { rejectUnauthorized: false }
}

export const pool = new Pool(poolConfig)
