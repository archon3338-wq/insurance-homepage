import type { Metadata } from "next";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "모바일 무료 보험 보장분석",
  description:
    "기본상담과 심화상담 중 원하는 상담을 고르면 전문 상담사가 연락드립니다.",
};

export default function MobilePage() {
  return (
    <div className="mobile-page">
      <SiteHeader />

      <main className="mobile-main">
        <p className="eyebrow">MOBILE REVIEW</p>
        <h1>
          보험 빈틈,
          <br />
          지금 확인해 보세요
        </h1>
        <p className="mobile-lead">
          기본상담과 심화상담 중 원하는 상담을 고르시면
          <br />
          상담사가 확인 후 연락드립니다.
        </p>

        <article className="inquiry-card">
          <h2 className="compare-title">기본상담 | 심화상담</h2>
          <p className="compare-foot">
            I RE:CARE는 기존 설계사 중심 상담이 아닌
            <br />
            고객 이익을 최우선으로 하며 가입권유는 하지 않습니다
          </p>
          <div className="compare-box">
            <div className="compare-col free">
              <h3>기본상담</h3>
              <ul>
                <li>내 보장분석 정확히 알기</li>
                <li>내 보험 한번에 파악하기</li>
                <li>내 보험 보상 확인</li>
              </ul>
            </div>
            <div className="compare-col paid">
              <h3>심화상담</h3>
              <ul>
                <li>기본상담+심층분석</li>
                <li>철저한 고객중심</li>
                <li>정확한 재무상태에 따른 분석</li>
                <li>재무상태에 따른 리모델링 의견</li>
              </ul>
            </div>
          </div>
          <a className="inquiry-btn" href="/#consult">
            내 보험 확인하기 →
          </a>
        </article>
      </main>
    </div>
  );
}
