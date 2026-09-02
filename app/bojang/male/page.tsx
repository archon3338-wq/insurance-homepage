import type { Metadata } from "next";
import GenderFiles from "../../GenderFiles";
import SiteHeader from "../../SiteHeader";

export const metadata: Metadata = {
  title: "보장분석 | 남성",
};

export default function MaleBojangPage() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap inner-page">
          <p className="eyebrow">보장분석 · 남성</p>
          <h1>남성 보장분석 자료</h1>
          <p className="intro">남성 자료를 이 화면에만 따로 올릴 수 있습니다.</p>
          <GenderFiles group="male" />
        </div>
      </main>
    </>
  );
}
