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

        <section className="sample-report">
          <div className="wrap">
            <div className="section-head">
              <p className="eyebrow">HOW WE ANALYZE</p>
              <h2>내 보험 이렇게 확인해 드려요</h2>
              <p className="section-lead">
                실제 상담에서 드리는 분석 파일 예시입니다. 개인 정보는 가린 상태로 보여 드립니다.
              </p>
            </div>
            <div className="sample-grid">
              <article className="sample-card">
                <div className="sample-thumb">
                  <img src="/sample-cover-table.png" alt="보장 금액 현황 분석 예시" />
                  <span className="sample-blur-tag">개인정보 보호</span>
                </div>
                <strong>보장 금액 한눈에 비교</strong>
                <p>현재 가입 금액과 목표 금액을 항목별로 비교해, 부족한지 충분한지 판정해 드립니다.</p>
              </article>
              <article className="sample-card">
                <div className="sample-thumb">
                  <img src="/sample-cover-bars.png" alt="핵심 보장 그래프 예시" />
                  <span className="sample-blur-tag">개인정보 보호</span>
                </div>
                <strong>핵심 보장·수술 그래프</strong>
                <p>핵심 보장을 그래프로 보여 드려, 어디에 공백이 있는지 바로 확인하실 수 있습니다.</p>
              </article>
              <article className="sample-card">
                <div className="sample-thumb">
                  <img src="/sample-cover-summary.png" alt="한 줄 요약과 보험료 구성 예시" />
                  <span className="sample-blur-tag">개인정보 보호</span>
                </div>
                <strong>한 줄 요약과 보험료 구성</strong>
                <p>빠진 보장, 실손 유지 여부, 월 보험료 등을 정리해 다음에 무엇을 손볼지 안내드립니다.</p>
              </article>
            </div>
            <ul className="sample-notes">
              <li>가입하신 보험을 표와 그래프로 정리해, 지금 보장과 목표 보장을 비교해 드립니다.</li>
              <li>부족·충분·과잉을 구분해 드면서 소비자 중심적인, 객관적으로 분석해 드립니다.</li>
              <li>상담 후에는 실제 분석 파일을 제공해, 같은 자료로 계속 확인하실 수 있습니다.</li>
            </ul>
          </div>
        </section>

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
          <div className="wrap legal-copy">
            <p>
              * 본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다.
              <br />
              * (주)글로벌금융판매 준법감시인 심의필 제00-00-0000호 (유효기간 0000-00-00 ~ 0000-00-00)
              <br />
              * 해당 모집종사자는 다수의 보험사와 계약체결 및 중개하는 보험설계사(보험대리점)입니다.
              <br />
              * 보험계약자가 기존 보험계약을 해지하고, 새로운 보험계약을 체결하는 과정에서
              <br />
              ① 질병이력, 연령증가 등으로 가입이 거절되거나 보험료가 인상될 수 있으며,
              <br />
              ② 가입상품에 따라 새로운 면책기간 적용 및 보장제한 등 기타 불이익이 발생할 수 있습니다.
            </p>
            <p>
              ㈜글로벌금융판매 (등록번호 : 2009091278호)
              <br />
              주영호 (협회 등록번호 : 20150590010003 호)
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
