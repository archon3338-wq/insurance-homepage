"use client";

import { useCallback, useEffect, useState } from "react";
import PayFlow from "./PayFlow";

type StatusItem = {
  id: string;
  maskedPhone: string;
  gender: string;
  status: string;
  createdAt: string;
};

const DEMO_STATUS: StatusItem[] = [
  { id: "d1", maskedPhone: "010-***-*821", gender: "여성", status: "접수완료", createdAt: "2026-09-02T04:10:00.000Z" },
  { id: "d2", maskedPhone: "010-***-*193", gender: "남성", status: "상담대기", createdAt: "2026-09-02T03:42:00.000Z" },
  { id: "d3", maskedPhone: "010-***-*750", gender: "여성", status: "접수완료", createdAt: "2026-09-02T03:18:00.000Z" },
  { id: "d4", maskedPhone: "010-***-*608", gender: "남성", status: "상담완료", createdAt: "2026-09-02T02:55:00.000Z" },
  { id: "d5", maskedPhone: "010-***-*341", gender: "여성", status: "접수완료", createdAt: "2026-09-02T02:31:00.000Z" },
  { id: "d6", maskedPhone: "010-***-*082", gender: "남성", status: "상담대기", createdAt: "2026-09-02T02:04:00.000Z" },
  { id: "d7", maskedPhone: "010-***-*714", gender: "여성", status: "접수완료", createdAt: "2026-09-02T01:47:00.000Z" },
  { id: "d8", maskedPhone: "010-***-*359", gender: "남성", status: "상담완료", createdAt: "2026-09-02T01:22:00.000Z" },
  { id: "d9", maskedPhone: "010-***-*460", gender: "여성", status: "접수완료", createdAt: "2026-09-02T00:58:00.000Z" },
  { id: "d10", maskedPhone: "010-***-*927", gender: "남성", status: "상담대기", createdAt: "2026-09-02T00:33:00.000Z" },
  { id: "d11", maskedPhone: "010-***-*204", gender: "여성", status: "접수완료", createdAt: "2026-09-01T23:51:00.000Z" },
  { id: "d12", maskedPhone: "010-***-*586", gender: "남성", status: "상담완료", createdAt: "2026-09-01T23:16:00.000Z" },
  { id: "d13", maskedPhone: "010-***-*835", gender: "여성", status: "접수완료", createdAt: "2026-09-01T22:40:00.000Z" },
  { id: "d14", maskedPhone: "010-***-*172", gender: "남성", status: "상담대기", createdAt: "2026-09-01T22:09:00.000Z" },
  { id: "d15", maskedPhone: "010-***-*948", gender: "여성", status: "접수완료", createdAt: "2026-09-01T21:37:00.000Z" },
  { id: "d16", maskedPhone: "010-***-*516", gender: "남성", status: "상담완료", createdAt: "2026-09-01T21:02:00.000Z" },
  { id: "d17", maskedPhone: "010-***-*701", gender: "여성", status: "접수완료", createdAt: "2026-09-01T20:28:00.000Z" },
  { id: "d18", maskedPhone: "010-***-*143", gender: "남성", status: "상담대기", createdAt: "2026-09-01T19:55:00.000Z" },
  { id: "d19", maskedPhone: "010-***-*629", gender: "여성", status: "접수완료", createdAt: "2026-09-01T19:21:00.000Z" },
  { id: "d20", maskedPhone: "010-***-*067", gender: "남성", status: "상담완료", createdAt: "2026-09-01T18:44:00.000Z" },
];

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
    maskedPhone: displayMaskedPhone(item.maskedPhone),
  }));
}

function displayMaskedPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  return `${digits.slice(0, 3)}-***-*${digits.slice(-3)}`;
}

export default function HomeHero() {
  const [items, setItems] = useState<StatusItem[]>(() => mixStatus(DEMO_STATUS));
  const [payOpen, setPayOpen] = useState(false);

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

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-intro">
          <p className="eyebrow">ABOUT I-RECARE</p>
          <h1>
            같은 상담, <em>결과는</em> 다릅니다
          </h1>
          <p className="hero-caption">내 보험을 정확히 아는 것이, 더 나은 오늘을 만듭니다.</p>
        </div>
        <div className="hero-split">
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
            <p className="status-foot">👥 오늘도 고객님의 보험을 하나씩 확인하고 있습니다</p>
          </div>
        </div>

        <div className="hero-col">
          <article className="inquiry-card" id="inquiry">
            <h2 className="compare-title">무료상담 vs 유료상담</h2>
            <div className="compare-box">
              <div className="compare-col free">
                <h3>💬 무료 보험상담</h3>
                <ul>
                  <li>고객 중심이 아닌 설계사 중심 상담</li>
                  <li>기존보험 해지 후 새보험 가입 권유</li>
                  <li>컨설팅이 아닌 상품 가입 권유</li>
                  <li>상품가입 중심 상담</li>
                </ul>
              </div>
              <div className="compare-col paid">
                <h3>✅ 유료 보험상담</h3>
                <ul>
                  <li>고객의 이익을 최우선으로 객관적 분석</li>
                  <li>필요한 보험과 중복보험 객관적 분석</li>
                  <li>본인보험 분석 파일 제공</li>
                  <li>보험 가입 권유 없는 100% 객관적 분석</li>
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
              내 보험 확인하기 →
            </button>
          </article>
        </div>
        </div>
      </div>

      {payOpen ? <PayFlow onClose={() => setPayOpen(false)} /> : null}
    </section>
  );
}
