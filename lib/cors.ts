import { NextResponse } from "next/server";

export const noStoreCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

export function jsonNoStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noStoreCors });
}

export function optionsNoStore() {
  return new NextResponse(null, { status: 204, headers: noStoreCors });
}
