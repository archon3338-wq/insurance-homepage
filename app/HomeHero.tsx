"use client";

import { useCallback, useEffect, useState } from "react";

type StatusItem = {
  id: string;
  maskedPhone: string;
  gender: string;
  status: string;
  createdAt: string;
};

const DEMO_STATUS: StatusItem[] = [
  { id: "d1", maskedPhone: "010-****-4821", gender: "여성", status: "접수완료", createdAt: "2026-09-02T04:10:00.000Z" },
  { id: "d2", maskedPhone: "010-****-1193", gender: "남성", status: "상담대기", createdAt: "2026-09-02T03:42:00.000Z" },
  { id: "d3", maskedPhone: "010-****-7750", gender: "여성", status: "접수완료", createdAt: "2026-09-02T03:18:00.000Z" },
  { id: "d4", maskedPhone: "010-****-2608", gender: "남성", status: "상담완료", createdAt: "2026-09-02T02:55:00.000Z" },
  { id: "d5", maskedPhone: "010-****-9341", gender: "여성", status: "접수완료", createdAt: "2026-09-02T02:31:00.000Z" },
  { id: "d6", maskedPhone: "010-****-5082", gender: "남성", status: "상담대기", createdAt: "2026-09-02T02:04:00.000Z" },
  { id: "d7", maskedPhone: "010-****-6714", gender: "여성", status: "접수완료", createdAt: "2026-09-02T01:47:00.000Z" },
  { id: "d8", maskedPhone: "010-****-3359", gender: "남성", status: "상담완료", createdAt: "2026-09-02T01:22:00.000Z" },
  { id: "d9", maskedPhone: "010-****-8460", gender: "여성", status: "접수완료", createdAt: "2026-09-02T00:58:00.000Z" },
  { id: "d10", maskedPhone: "010-****-1927", gender: "남성", status: "상담대기", createdAt: "2026-09-02T00:33:00.000Z" },
  { id: "d11", maskedPhone: "010-****-7204", gender: "여성", status: "접수완료", createdAt: "2026-09-01T23:51:00.000Z" },
  { id: "d12", maskedPhone: "010-****-4586", gender: "남성", status: "상담완료", createdAt: "2026-09-01T23:16:00.000Z" },
  { id: "d13", maskedPhone: "010-****-0835", gender: "여성", status: "접수완료", createdAt: "2026-09-01T22:40:00.000Z" },
  { id: "d14", maskedPhone: "010-****-6172", gender: "남성", status: "상담대기", createdAt: "2026-09-01T22:09:00.000Z" },
  { id: "d15", maskedPhone: "010-****-2948", gender: "여성", status: "접수완료", createdAt: "2026-09-01T21:37:00.000Z" },
  { id: "d16", maskedPhone: "010-****-9516", gender: "남성", status: "상담완료", createdAt: "2026-09-01T21:02:00.000Z" },
  { id: "d17", maskedPhone: "010-****-3701", gender: "여성", status: "접수완료", createdAt: "2026-09-01T20:28:00.000Z" },
  { id: "d18", maskedPhone: "010-****-8143", gender: "남성", status: "상담대기", createdAt: "2026-09-01T19:55:00.000Z" },
  { id: "d19", maskedPhone: "010-****-5629", gender: "여성", status: "접수완료", createdAt: "2026-09-01T19:21:00.000Z" },
  { id: "d20", maskedPhone: "010-****-1067", gender: "남성", status: "상담완료", createdAt: "2026-09-01T18:44:00.000Z" },
];

type Plan = "basic" | "premium";

function shuffle<T>(list: T[]) {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function mixStatus(list: StatusItem[]) {
  return shuffle(list).map((item) => ({
    ...item,
    gender: Math.random() < 0.5 ? "남성" : "여성",
  }));
}

export default function HomeHero() {
  const [items, setItems] = useState<StatusItem[]>(() => mixStatus(DEMO_STATUS));
  const [payOpen, setPayOpen] = useState(false);
  const [plan, setPlan] = useState<Plan>("basic");
  const [payMessage, setPayMessage] = useState("");

  const loadStatus = useCallback(() => {
    fetch("/api/lead-status")
      .then((res) => res.json())
      .then((data: { items?: StatusItem[] }) => {
        const next = data.items || [];
        setItems(mixStatus(next.length >= 8 ? next : DEMO_STATUS));
      })
      .catch(() => setItems(mixStatus(DEMO_STATUS)));
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  function requestPay() {
    const label = plan === "basic" ? "베이직 30,000원" : "프리미엄 100,000원";
    setPayMessage(
      `${label} 결제창입니다. 실제 카드 결제는 다음 단계에서 연결됩니다.`,
    );
  }

  return (
    <section className="hero">
      <div className="wrap hero-split">
        <div className="hero-col">
          <div className="status-board">
            <div className="status-head">
              <p className="eyebrow">LIVE STATUS</p>
              <h2>접수 현황</h2>
              <p>최근 접수된 상담 현황입니다. 번호는 일부만 공개됩니다.</p>
            </div>
            <div className="status-scroll">
              <ul className="status-list">
                {[...items, ...items].map((item, index) => (
                  <li key={`${item.id}-${index}`}>
                    <span className="status-phone">{item.maskedPhone}</span>
                    <span className="status-meta">{item.gender}</span>
                    <span className="status-badge">{item.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="hero-col">
          <article className="inquiry-card" id="inquiry">
            <h2 className="compare-title">무료 상담 vs 유료 상담</h2>
            <p className="compare-sub">같은 상담, 결과는 다릅니다</p>
            <div className="compare-box">
              <div className="compare-col free">
                <h3>무료 보험상담</h3>
                <ul>
                  <li>고객 중심이 아닌 설계사 중심 상담</li>
                  <li>기존보험 해지 후 새보험 가입 권유</li>
                  <li>컨설팅이 아닌 상품 가입 권유</li>
                  <li>상품가입 중심 상담</li>
                </ul>
              </div>
              <div className="compare-col paid">
                <h3>유료 보험상담</h3>
                <ul>
                  <li>고객의 이익을 최우선으로 객관적 분석</li>
                  <li>필요한 보험과 중복보험 객관적 분석</li>
                  <li>본인보험 분석 파일 제공</li>
                  <li>장기적인 재무계획과 연계된 상담</li>
                </ul>
              </div>
            </div>
            <p className="compare-foot">
              중요한 것은 상담료가 아니라,
              <br />
              <em className="em-red">잘못된 보험료 지출</em>을 얼마나 줄이고,
              <br />
              <em className="em-blue">내 보험을 정확하게 파악하고 있는지</em> 입니다
            </p>
            <button type="button" className="inquiry-btn" onClick={() => setPayOpen(true)}>
              문의하기
            </button>
          </article>
        </div>
      </div>

      {payOpen ? (
        <div className="modal-back" onClick={() => setPayOpen(false)}>
          <div
            className="modal"
            role="dialog"
            aria-labelledby="pay-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setPayOpen(false)}>
              닫기
            </button>
            <h3 id="pay-title">분석 상담 결제</h3>
            <p className="modal-sub">원하시는 플랜을 고른 뒤 결제를 진행해 주세요.</p>

            <div className="plan-grid">
              <label className={`plan ${plan === "basic" ? "on" : ""}`}>
                <input
                  type="radio"
                  name="plan"
                  checked={plan === "basic"}
                  onChange={() => setPlan("basic")}
                />
                <strong>베이직</strong>
                <em>30,000원</em>
                <ul className="plan-points">
                  <li>보장분석 상담</li>
                  <li>분석 파일 제공</li>
                  <li>보험 분석 후 콜 or 메신저 상담</li>
                </ul>
              </label>
              <label className={`plan ${plan === "premium" ? "on" : ""}`}>
                <input
                  type="radio"
                  name="plan"
                  checked={plan === "premium"}
                  onChange={() => setPlan("premium")}
                />
                <strong>프리미엄</strong>
                <em>100,000원</em>
                <ul className="plan-points">
                  <li>심화분석 + 가족 보험 상담</li>
                  <li>분석 파일 제공(상세내용)</li>
                  <li>
                    보험 분석 후 콜 or 메신저 or{" "}
                    <span className="plan-hot">대면 상담</span>
                  </li>
                </ul>
              </label>
            </div>

            <button type="button" className="pay-btn" onClick={requestPay}>
              {plan === "basic" ? "30,000원" : "100,000원"} 결제하기
            </button>
            {payMessage ? <p className="msg ok">{payMessage}</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
