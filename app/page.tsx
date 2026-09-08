import HomeHero from "./HomeHero";
import { IconFamily, IconHospital, IconOverlap } from "./ReasonIcons";
import SiteHeader from "./SiteHeader";

export default function HomePage() {
  return (
    <>
      <div className="home-shell">
        <SiteHeader />
        <HomeHero />
      </div>

      <main>

        <section className="reasons">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">WHY I-RECARE</p>
              <h2>이런 때 확인해 보세요</h2>
            </div>
            <div className="reason-cols">
              <article>
                <span className="reason-icon">
                  <IconOverlap />
                </span>
                <strong>보장이 겹치는지 궁금할 때</strong>
                <p>비슷한 특약이 중복되어 보험료만 나가고 있을 수 있습니다.</p>
              </article>
              <article>
                <span className="reason-icon">
                  <IconHospital />
                </span>
                <strong>병원비·실손 공백이 걱정될 때</strong>
                <p>실제 필요한 보장과 빠진 부분을 기준으로 안내드립니다.</p>
              </article>
              <article>
                <span className="reason-icon">
                  <IconFamily />
                </span>
                <strong>내 가족은 어떻게 보상 받을 수 있을까?</strong>
                <p>가족 전체 보상관련 전문적으로 상담 받아 보실 수 있습니다.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="legal">
          <div className="wrap">
            <ol>
              <li>(상호) 보험대리점 (협회 등록번호 : 추후 입력)</li>
              <li>준법심의필 번호 및 유효기간 (추후 입력)</li>
              <li>
                본 광고는 광고 심의 기준을 준수하였으며, 유효기간은 심의일로부터
                1년입니다.
              </li>
              <li>
                보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는
                과정에서 (1) 질병이력, 연령증가 등으로 가입이 거절되거나
                보험료가 인상될 수 있습니다. (2) 가입 상품에 따라 새로운
                면책기간 적용 및 보장 제한 등 기타 불이익이 발생할 수 있습니다.
              </li>
            </ol>
          </div>
        </section>
      </main>

      <footer className="company-foot">
        <div className="wrap company-inner">
          <div className="company-meta">
            <p>
              <a className="privacy-link" href="/privacy">
                개인정보처리방침
              </a>
            </p>
            <p>(08513) 서울특별시 금천구 디지털로 178, A 동 520호</p>
            <p>TEL:1577-6252 / FAX:02-6008-1612</p>
            <p>사업자등록번호:131-86-16703</p>
            <p>보험대리점 등록번호:제2009091278호</p>
            <p className="company-copy">Copyright © 2011-2024 GLOBAL FM. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
