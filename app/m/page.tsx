import type { Metadata } from "next";
import LeadForm from "../LeadForm";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "모바일 무료 보험 보장분석",
  description:
    "휴대폰에서 전화번호, 생년월일, 성별만 남기면 전문 상담사가 연락드립니다.",
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
          전화번호 · 생년월일 · 성별만 남기시면
          <br />
          상담사가 직접 전화드립니다.
        </p>

        <ul className="mobile-chips">
          <li>중복 보장 확인</li>
          <li>부족한 보장 정리</li>
          <li>부담 없는 상담</li>
        </ul>

        <LeadForm />

        <section className="mobile-why">
          <h2>이런 때 신청하세요</h2>
          <article>
            <strong>보험을 여러 건 들고 있을 때</strong>
            <p>비슷한 보장이 겹쳐 보험료만 나가고 있을 수 있습니다.</p>
          </article>
          <article>
            <strong>실손·병원비가 걱정될 때</strong>
            <p>빠진 보장을 기준으로 알기 쉽게 안내드립니다.</p>
          </article>
          <article>
            <strong>내 가족은 어떻게 보상 받을 수 있을까</strong>
            <p>가족 전체 보상관련 전문적으로 상담 받아 보실 수 있습니다.</p>
          </article>
        </section>

        <div className="notice">
          <h3>개인정보 안내</h3>
          <p>
            수집 항목: 전화번호, 생년월일, 성별 / 이용 목적: 보장분석 상담 연락
            / 신청 정보는 zoocci@naver.com으로 전달됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
