import { NextResponse } from "next/server";
import { isBojangGroup, listBojangFiles, removeBojangFile, saveBojangFile } from "@/lib/bojangFiles";

export const runtime = "nodejs";

const ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/haansofthwp",
  "application/x-hwp",
];

function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "changeme";
  return password === expected;
}

export async function GET(request: Request) {
  const group = new URL(request.url).searchParams.get("group") || "";
  const files = await listBojangFiles(isBojangGroup(group) ? group : undefined);
  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const password = String(form.get("password") || "");
    const groupValue = String(form.get("group") || "male");
    const file = form.get("file");

    if (!checkPassword(password)) {
      return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    if (!isBojangGroup(groupValue)) {
      return NextResponse.json({ error: "남성 또는 여성을 선택해 주세요." }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "파일을 선택해 주세요." }, { status: 400 });
    }

    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: "12MB 이하 파일만 올릴 수 있습니다." }, { status: 400 });
    }

    if (file.type && !ALLOWED.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png|webp|doc|docx|xls|xlsx|hwp)$/i)) {
      return NextResponse.json(
        { error: "PDF, 이미지, 문서 파일만 올릴 수 있습니다." },
        { status: 400 },
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const saved = await saveBojangFile(file.name, bytes, groupValue);
    return NextResponse.json({ ok: true, file: saved });
  } catch {
    return NextResponse.json(
      { error: "파일 저장에 실패했습니다. 배포 환경에서는 폴더에 직접 넣는 방식을 사용해 주세요." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get("password") || "";
  const id = searchParams.get("id") || "";

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const ok = await removeBojangFile(id);
  if (!ok) {
    return NextResponse.json({ error: "파일을 찾지 못했습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
