import { z } from 'zod';

// --- Data Schemas ---

// Transaction/Event record (anonymized, aggregated)
export const TransactionRecord = z.object({
  source_id: z.string(), // anonymized user or community
  target_id: z.string(), // anonymized user or community
  weight: z.number(), // aggregated event count or value
  community_id: z.string(),
  timestamp: z.string(), // ISO8601, bucketed
});

// Regional flow record (for Geopolitical module)
export const RegionalFlowRecord = z.object({
  from_region: z.string(),
  to_region: z.string(),
  value: z.number(),
  type: z.string(), // e.g., 'goods', 'services', 'remittance'
  timestamp: z.string(),
});

// Input-Output matrix record
export const InputOutputRecord = z.object({
  from_sector: z.string(),
  to_sector: z.string(),
  value: z.number(),
  type: z.string(),
  timestamp: z.string(),
});

// --- Types ---
export type TransactionRecord = z.infer<typeof TransactionRecord>;
export type RegionalFlowRecord = z.infer<typeof RegionalFlowRecord>;
export type InputOutputRecord = z.infer<typeof InputOutputRecord>;

// --- Example: Anonymized ETL Output Types ---
export type ETLData = {
  transactions: TransactionRecord[];
  regionalFlows: RegionalFlowRecord[];
  inputOutput: InputOutputRecord[];
};
