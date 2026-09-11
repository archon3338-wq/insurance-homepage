"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type BoardPost = {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BoardPostView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BoardPost | null>(null);
  const [missing, setMissing] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/board/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setMissing(true);
          return;
        }
        const data = (await res.json()) as { post?: BoardPost };
        setPost(data.post || null);
        if (!data.post) setMissing(true);
      })
      .catch(() => setMissing(true));
  }, [id]);

  async function onDelete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!id) return;
    setDeleting(true);
    setMessage("");

    try {
      const response = await fetch(`/api/board/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setMessage(data.error || "삭제에 실패했습니다.");
        setDeleting(false);
        return;
      }

      router.push("/board");
    } catch {
      setMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setDeleting(false);
    }
  }

  if (missing) {
    return (
      <main className="info-page board-page">
        <div className="wrap board-narrow">
          <div className="info-head">
            <h1>게시판</h1>
            <p>글을 찾을 수 없습니다.</p>
          </div>
          <Link className="board-write-btn" href="/board">
            목록으로
          </Link>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="info-page board-page">
        <div className="wrap">
          <p className="info-empty">글을 불러오는 중입니다.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="info-page board-page">
      <div className="wrap board-narrow">
        <article className="board-article">
          <h1>{post.title}</h1>
          <p className="board-article-meta">
            <span>{post.author}</span>
            <span>{formatDate(post.createdAt)}</span>
          </p>
          <div className="board-body">{post.content}</div>
        </article>

        <form className="board-delete" onSubmit={onDelete}>
          <label htmlFor="board-delete-password">작성 시 설정한 비밀번호</label>
          <div className="board-actions">
            <Link className="board-ghost" href="/board">
              목록
            </Link>
            <input
              id="board-delete-password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="board-delete-btn" disabled={deleting}>
              {deleting ? "삭제 중..." : "삭제"}
            </button>
          </div>
          {message ? <p className="msg err">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
