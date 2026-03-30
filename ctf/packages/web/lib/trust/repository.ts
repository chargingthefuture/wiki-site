import type { TrustUserExtension } from "./types";
import { getTrustUserExtension as getTrustUserExtensionDb } from "./db";

export async function getTrustUserExtension(userId: string): Promise<TrustUserExtension> {
  // TODO: Add audit logging here
  return getTrustUserExtensionDb(userId);
}
