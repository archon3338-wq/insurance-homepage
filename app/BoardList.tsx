"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BoardSummary = {
  id: string;
  title: string;
  author: string;
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

export default function BoardList() {
  const [posts, setPosts] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/board")
      .then((res) => res.json())
      .then((data: { posts?: BoardSummary[] }) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="info-page board-page">
      <div className="wrap">
        <div className="info-head">
          <h1>게시판</h1>
          <p>궁금한 점을 남겨 주세요. 글 작성 시 비밀번호를 설정하면 직접 삭제할 수 있습니다.</p>
        </div>

        <div className="board-toolbar">
          <p className="board-count">{loading ? "불러오는 중..." : `전체 ${posts.length}건`}</p>
          <Link className="board-write-btn" href="/board/write">
            글쓰기
          </Link>
        </div>

        {posts.length === 0 && !loading ? (
          <p className="info-empty">아직 글이 없습니다. 첫 글을 남겨 보세요.</p>
        ) : (
          <div className="board-list">
            {posts.map((post) => (
              <Link key={post.id} className="board-item" href={`/board/${post.id}`}>
                <strong className="board-item-title">{post.title}</strong>
                <span className="board-item-author">{post.author}</span>
                <span className="board-item-date">{formatDate(post.createdAt)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
