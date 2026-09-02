import type { Metadata } from "next";
import GenderFiles from "../../GenderFiles";
import SiteHeader from "../../SiteHeader";

export const metadata: Metadata = {
  title: "보장분석 | 여성",
};

export default function FemaleBojangPage() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap inner-page">
          <p className="eyebrow">보장분석 · 여성</p>
          <h1>여성 보장분석 자료</h1>
          <p className="intro">여성 자료를 이 화면에만 따로 올릴 수 있습니다.</p>
          <GenderFiles group="female" />
        </div>
      </main>
    </>
  );
}
