"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PayFlow from "./PayFlow";

export default function SiteHeader() {
  const [consultOpen, setConsultOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash === "#consult" || window.location.hash === "#join") {
      setConsultOpen(true);
    }
  }, []);

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-text">
              <strong className="brand-main">아이리케어</strong>
              <span className="brand-sub">내 보험, 다시 케어하다</span>
            </span>
          </Link>
          <div className="topbar-actions">
            <Link className={`menu-link${pathname === "/" ? " on" : ""}`} href="/">
              홈
            </Link>
            <Link className={`menu-link${pathname === "/info" ? " on" : ""}`} href="/info">
              보상및정보
            </Link>
            <Link className={`menu-link${pathname.startsWith("/board") ? " on" : ""}`} href="/board">
              게시판
            </Link>
          </div>
          <button type="button" className="nav-btn" onClick={() => setConsultOpen(true)}>
            내 보험 확인
          </button>
        </div>
      </header>

      {consultOpen ? <PayFlow onClose={() => setConsultOpen(false)} /> : null}
    </>
  );
}
