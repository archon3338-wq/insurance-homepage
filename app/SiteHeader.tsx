"use client";

import Link from "next/link";
import { useState } from "react";
import JoinForm from "./JoinForm";

export default function SiteHeader() {
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link className="brand" href="/">
            <strong className="brand-main">아이리케어</strong>
          </Link>
          <button type="button" className="nav-btn" onClick={() => setJoinOpen(true)}>
            입사문의
          </button>
        </div>
      </header>

      {joinOpen ? (
        <div className="modal-back" onClick={() => setJoinOpen(false)}>
          <div
            className="modal join-modal"
            role="dialog"
            aria-labelledby="join-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setJoinOpen(false)}>
              닫기
            </button>
            <h3 id="join-title">입사문의</h3>
            <p className="modal-sub">아래 정보를 남겨 주시면 확인 후 연락드립니다.</p>
            <JoinForm privacyHref="/privacy" />
          </div>
        </div>
      ) : null}
    </>
  );
}
