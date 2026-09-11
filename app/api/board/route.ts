import { NextResponse } from "next/server";
import { createBoardPost, listBoardPosts } from "@/lib/board";

export const runtime = "nodejs";

export async function GET() {
  const posts = await listBoardPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      title?: string;
      author?: string;
      content?: string;
      password?: string;
    };

    const post = await createBoardPost({
      title: body.title || "",
      author: body.author || "",
      content: body.content || "",
      password: body.password || "",
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.";
    const status = message.includes("입력") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
