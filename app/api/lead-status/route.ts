import { NextResponse } from "next/server";
import { listLeadStatus } from "@/lib/leadStatus";

export const runtime = "nodejs";

export async function GET() {
  const items = await listLeadStatus();
  return NextResponse.json({ items, total: items.length });
}
