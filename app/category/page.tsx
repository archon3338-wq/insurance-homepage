import type { Metadata } from "next";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "카테고리",
};

export default function CategoryPage() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap inner-page">
          <p className="eyebrow" style={{ color: "#c4a35a" }}>
            카테고리
          </p>
          <h1>카테고리</h1>
          <p className="intro">
            이 메뉴에 넣고 싶은 항목이 있으면 알려 주세요. 지금은 자리를 만들어
            둔 상태입니다.
          </p>
        </div>
      </main>
    </>
  );
}
