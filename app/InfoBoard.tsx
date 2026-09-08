"use client";

import { useMemo, useState } from "react";

type Category = "전체" | "보상" | "정보";

type Post = {
  id: string;
  category: Exclude<Category, "전체">;
  title: string;
  date: string;
  tone: "blue" | "green";
  href?: string;
  image?: string;
};

const INFO_BLOG = "https://blog.naver.com/punditclass/224398888400";

const POSTS: Post[] = [
  {
    id: "1",
    category: "정보",
    title: "암 진단비 청구했는데, 거절?",
    date: "2026-09-03",
    tone: "green",
    href: INFO_BLOG,
    image: "/thumb-algi-bosang.jpg",
  },
];

const TABS: Category[] = ["전체", "보상", "정보"];

export default function InfoBoard() {
  const [tab, setTab] = useState<Category>("전체");
  const [query, setQuery] = useState("");

  const posts = useMemo(() => {
    const q = query.trim();
    return POSTS.filter((post) => {
      const matchTab = tab === "전체" || post.category === tab;
      const matchQuery = !q || post.title.includes(q) || post.category.includes(q);
      return matchTab && matchQuery;
    });
  }, [tab, query]);

  return (
    <main className="info-page">
      <div className="wrap">
        <div className="info-head">
          <h1>보상및정보</h1>
          <p>고객의 권리를 찾아 드립니다</p>
        </div>

        <div className="info-toolbar">
          <div className="info-tabs" role="tablist">
            {TABS.map((item) => (
              <button
                key={item}
                type="button"
                className={`info-tab${tab === item ? " on" : ""}`}
                onClick={() => setTab(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="info-search">
            <span aria-hidden="true">🔍</span>
            <input
              type="search"
              placeholder="검색어를 입력하세요..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        <div className="info-grid">
          {posts.map((post, index) => {
            const slide =
              index % 3 === 0 ? "slide-in-left" : index % 3 === 2 ? "slide-in-right" : "slide-in-fade";
            const className = `info-card ${slide}`;
            const body = (
              <>
                <div className={`info-thumb ${post.tone}${post.image ? " has-image" : ""}`}>
                  <span className={`info-badge ${post.tone}`}>{post.category}</span>
                  {post.image ? (
                    <img src={post.image} alt={post.title} />
                  ) : (
                    <strong>{post.title}</strong>
                  )}
                </div>
                <div className="info-meta">
                  <span>📅 {post.date}</span>
                  <span>🏷 {post.category}</span>
                </div>
              </>
            );

            if (post.href) {
              return (
                <a
                  key={`${tab}-${post.id}`}
                  className={className}
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {body}
                </a>
              );
            }

            return (
              <article key={`${tab}-${post.id}`} className={className}>
                {body}
              </article>
            );
          })}
        </div>
        {posts.length === 0 ? (
          <p className="info-empty">해당하는 글이 없습니다.</p>
        ) : null}
      </div>
    </main>
  );
}
