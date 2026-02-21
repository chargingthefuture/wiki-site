import { Pool } from "pg";
import { getRequiredServerEnv } from "./providerEnv";

let pool: Pool | null = null;

export const getDbPool = () => {
  if (pool) {
    return pool;
  }

  const connectionString = getRequiredServerEnv("DATABASE_URL");

  pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    max: 5,
  });

  return pool;
};
