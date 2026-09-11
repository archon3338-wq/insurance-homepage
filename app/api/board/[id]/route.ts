import { NextResponse } from "next/server";
import { deleteBoardPost, getBoardPost } from "@/lib/board";

export const runtime = "nodejs";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  const post = await getBoardPost(id);
  if (!post) {
    return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ post });
}

export async function DELETE(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as { password?: string };
    const password = (body.password || "").trim();

    if (password.length < 4) {
      return NextResponse.json(
        { error: "비밀번호를 입력해 주세요." },
        { status: 400 },
      );
    }

    const result = await deleteBoardPost(id, password);
    if (result === "missing") {
      return NextResponse.json({ error: "글을 찾을 수 없습니다." }, { status: 404 });
    }
    if (result === "forbidden") {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 403 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
