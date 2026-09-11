"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function BoardWrite() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, content, password }),
      });
      const data = (await response.json()) as { error?: string; post?: { id: string } };

      if (!response.ok || !data.post) {
        setStatus("error");
        setMessage(data.error || "글 등록에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      router.push(`/board/${data.post.id}`);
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <main className="info-page board-page">
      <div className="wrap board-narrow">
        <div className="info-head">
          <h1>글쓰기</h1>
          <p>비밀번호를 설정해 두면 나중에 글을 삭제할 수 있습니다.</p>
        </div>

        <form className="board-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="board-title">제목</label>
            <input
              id="board-title"
              type="text"
              maxLength={80}
              placeholder="제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="board-author">작성자</label>
            <input
              id="board-author"
              type="text"
              maxLength={20}
              placeholder="이름"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="board-content">내용</label>
            <textarea
              id="board-content"
              maxLength={5000}
              placeholder="내용을 입력해 주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="board-password">비밀번호</label>
            <input
              id="board-password"
              type="password"
              autoComplete="new-password"
              minLength={4}
              maxLength={40}
              placeholder="삭제 시 필요합니다 (4자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="board-actions">
            <Link className="board-ghost" href="/board">
              목록
            </Link>
            <button type="submit" className="board-write-btn" disabled={status === "loading"}>
              {status === "loading" ? "등록 중..." : "등록하기"}
            </button>
          </div>
          {message ? <p className="msg err">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
