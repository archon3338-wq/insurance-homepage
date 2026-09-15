import { jsonNoStore, optionsNoStore } from "@/lib/cors";
import { listLeadStatus, replaceLeadStatus } from "@/lib/leadStatus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export function OPTIONS() {
  return optionsNoStore();
}

export async function GET() {
  const items = await listLeadStatus();
  return jsonNoStore({ items });
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as {
      githubToken?: string;
      items?: Array<{
        id?: string;
        phone?: string;
        maskedPhone?: string;
        gender?: string;
        status?: string;
        createdAt?: string;
      }>;
    };

    if (!Array.isArray(body.items)) {
      return jsonNoStore({ error: "접수현황 데이터가 올바르지 않습니다." }, 400);
    }

    const items = await replaceLeadStatus(body.items, body.githubToken?.trim());
    return jsonNoStore({ ok: true, items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "저장에 실패했습니다.";
    return jsonNoStore({ error: message }, 500);
  }
}
