import { NextResponse } from "next/server";
import { isBojangGroup, listBojangFiles } from "@/lib/bojangFiles";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const group = new URL(request.url).searchParams.get("group") || "";
  const files = await listBojangFiles(isBojangGroup(group) ? group : undefined);
  return NextResponse.json({ files });
}
