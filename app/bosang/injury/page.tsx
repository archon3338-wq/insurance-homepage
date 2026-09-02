import type { Metadata } from "next";
import SiteHeader from "../../SiteHeader";

export const metadata: Metadata = {
  title: "상해 보상 안내",
};

export default function InjuryPage() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap inner-page">
          <p className="eyebrow" style={{ color: "#c4a35a" }}>
            보상 · 상해
          </p>
          <h1>상해 보상</h1>
          <p className="intro">
            사고로 다쳤을 때 받을 수 있는 상해 보상 내용을 정리하는
            페이지입니다. 원하시는 안내 문구가 있으면 이 화면에 넣어 드릴 수
            있습니다.
          </p>
          <div className="item">
            <strong>상담이 필요하시면</strong>
            <p>보장분석 신청을 남겨 주시면 전화로 안내드립니다.</p>
          </div>
        </div>
      </main>
    </>
  );
}
