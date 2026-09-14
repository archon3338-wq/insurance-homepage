import { jsonNoStore, optionsNoStore } from "@/lib/cors";
import { listLeadStatus } from "@/lib/leadStatus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function OPTIONS() {
  return optionsNoStore();
}

export async function GET() {
  const items = await listLeadStatus();
  return jsonNoStore({ items, total: items.length });
}
