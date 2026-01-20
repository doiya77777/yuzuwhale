import "server-only";
import { lookup } from "node:dns/promises";

let cachedReachable: boolean | null = null;

export async function canReachSupabase(url?: string | null): Promise<boolean> {
  if (!url) {
    return false;
  }
  if (cachedReachable !== null) {
    return cachedReachable;
  }
  try {
    const hostname = new URL(url).hostname;
    await lookup(hostname);
    cachedReachable = true;
  } catch {
    cachedReachable = false;
  }
  return cachedReachable;
}
