"use client";

import { FormEvent, useState } from "react";

type Plan = "basic" | "premium";
type Step = "plan" | "form" | "pay";

type PayFlowProps = {
  onClose: () => void;
};

function isAdult(birthDate: string) {
  const birth = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return false;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age >= 19;
}

function planLabel(plan: Plan) {
  return plan === "basic" ? "기본상담" : "심화상담";
}

export function PrivacyNotice() {
  return (
    <div className="privacy-notice">
      <h4>1. 수집하는 개인정보 항목</h4>
      <p>성명, 휴대폰 번호, 연령대, 관심 항목(상담 내용)</p>
      <p>
        이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 하기 목적 이외의
        용도로는 사용되지 않습니다.
      </p>

      <h4>2. 개인정보 수집·이용 목적</h4>
      <p>보험 상담 서비스 제공, 맞춤형 보험 상품 안내, 상담 이력 관리 및 고객 응대</p>

      <h4>3. 개인정보 보유 및 이용 기간</h4>
      <p>
        상담 서비스 제공일로부터 <strong>1년</strong> 또는 고객 동의 철회 시까지.
      </p>
      <ul>
        <li>전자상거래법 — 계약·청약철회 기록: 5년</li>
        <li>통신비밀보호법 — 로그 기록: 3개월</li>
      </ul>

      <h4>4. 개인정보 제3자 제공</h4>
      <table className="privacy-table">
        <thead>
          <tr>
            <th>항목</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>제공받는 자</th>
            <td>(주)글로벌금융판매 및 제휴 보험설계사</td>
          </tr>
          <tr>
            <th>제공 목적</th>
            <td>보험 상담 서비스 제공 및 보험료 비교 안내</td>
          </tr>
          <tr>
            <th>제공 항목</th>
            <td>성명, 연락처, 연령대, 상담 내용</td>
          </tr>
          <tr>
            <th>보유·이용 기간</th>
            <td>상담 목적 달성 후 즉시 파기 (최대 6개월)</td>
          </tr>
        </tbody>
      </table>

      <h4>5. 동의 거부 권리</h4>
      <p>동의를 거부할 수 있으며, 거부 시 상담 서비스 이용이 제한될 수 있습니다.</p>

      <h4>6. 개인정보 처리 책임자</h4>
      <p>(주)글로벌금융판매 프라임S 보험설계사 주영호</p>
    </div>
  );
}

export default function PayFlow({ onClose }: PayFlowProps) {
  const [step, setStep] = useState<Step>("plan");
  const [plan, setPlan] = useState<Plan>("basic");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [payDone, setPayDone] = useState(false);

  function openAmount(next: Plan) {
    setPlan(next);
    setStep("form");
    setMessage("");
  }

  function onConsentToggle(checked: boolean) {
    if (checked) {
      setPolicyOpen(true);
      return;
    }
    setConsent(false);
  }

  function confirmPolicy() {
    setConsent(true);
    setPolicyOpen(false);
  }

  function onSubmitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (name.trim().length < 2) {
      setMessage("성함을 입력해 주세요.");
      return;
    }
    if (!isAdult(birthDate)) {
      setMessage("만 19세 이상의 생년월일을 입력해 주세요.");
      return;
    }
    if (!gender) {
      setMessage("성별을 선택해 주세요.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setMessage("핸드폰번호를 올바르게 입력해 주세요.");
      return;
    }
    if (!consent) {
      setMessage("개인정보 제3자 제공에 동의해 주세요.");
      setPolicyOpen(true);
      return;
    }

    setStep("pay");
  }

  return (
    <div className="modal-back" onClick={onClose}>
      <div
        className="modal pay-modal"
        role="dialog"
        aria-labelledby="pay-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose}>
          닫기
        </button>

        {step === "plan" ? (
          <>
            <h3 id="pay-title">상담 신청</h3>
            <p className="modal-sub">원하시는 상담을 눌러 주세요.</p>
            <div className="plan-grid">
              <label className={`plan ${plan === "basic" ? "on" : ""}`}>
                <input
                  type="radio"
                  name="plan"
                  checked={plan === "basic"}
                  onChange={() => setPlan("basic")}
                />
                <strong>기본상담</strong>
                <ul className="plan-points">
                  <li>내 보험 알기</li>
                  <li>내 보상 알기</li>
                  <li>PDF 파일 제공</li>
                </ul>
              </label>
              <label className={`plan ${plan === "premium" ? "on" : ""}`}>
                <input
                  type="radio"
                  name="plan"
                  checked={plan === "premium"}
                  onChange={() => setPlan("premium")}
                />
                <strong>심화상담</strong>
                <ul className="plan-points">
                  <li>기본상담+심층상담</li>
                  <li>고객중심 상담</li>
                  <li>재무상태분석</li>
                  <li>리모델링 제안</li>
                </ul>
              </label>
            </div>
            <div className="pay-amount-row">
              <button type="button" className="pay-btn" onClick={() => openAmount("basic")}>
                기본분석
              </button>
              <button type="button" className="pay-btn" onClick={() => openAmount("premium")}>
                심화상담
              </button>
            </div>
          </>
        ) : null}

        {step === "form" ? (
          <form className="pay-form" onSubmit={onSubmitForm}>
            <button type="button" className="pay-back" onClick={() => setStep("plan")}>
              ← 상담 다시 선택
            </button>
            <h3 id="pay-title">{planLabel(plan)} 신청 정보</h3>
            <p className="modal-sub">{planLabel(plan)} 진행을 위해 아래 정보를 입력해 주세요.</p>

            <div className="field">
              <label htmlFor="pay-name">성함</label>
              <input
                id="pay-name"
                type="text"
                autoComplete="name"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="pay-birth">생년월일</label>
              <input
                id="pay-birth"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="pay-gender">성별</label>
              <select
                id="pay-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">선택해 주세요</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="pay-phone">핸드폰번호</label>
              <input
                id="pay-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <label className="consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => onConsentToggle(e.target.checked)}
              />
              <span>
                [필수] 개인정보 제3자 제공에 동의합니다.{" "}
                <button
                  type="button"
                  className="consent-link"
                  onClick={() => setPolicyOpen(true)}
                >
                  내용 보기
                </button>
              </span>
            </label>

            <button type="submit" className="pay-btn">
              상담 신청하기
            </button>
            {message ? <p className="msg err">{message}</p> : null}
          </form>
        ) : null}

        {step === "pay" ? (
          <div className="pg-window">
            <p className="pg-brand">상담 신청</p>
            <h3 id="pay-title">신청 확인</h3>
            <p className="modal-sub">입력하신 정보로 상담을 접수합니다.</p>
            <dl className="pg-summary">
              <div>
                <dt>신청자</dt>
                <dd>{name}</dd>
              </div>
              <div>
                <dt>상담</dt>
                <dd>{planLabel(plan)}</dd>
              </div>
            </dl>
            {payDone ? (
              <p className="msg ok">신청이 전달되었습니다. 상담사가 확인 후 연락드립니다.</p>
            ) : (
              <button type="button" className="pay-btn" onClick={() => setPayDone(true)}>
                신청 완료
              </button>
            )}
          </div>
        ) : null}
      </div>

      {policyOpen ? (
        <div
          className="modal-back policy-back"
          onClick={(e) => {
            e.stopPropagation();
            setPolicyOpen(false);
          }}
        >
          <div
            className="modal policy-modal"
            role="dialog"
            aria-labelledby="policy-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className="modal-close" onClick={() => setPolicyOpen(false)}>
              닫기
            </button>
            <h3 id="policy-title">개인정보처리방침</h3>
            <PrivacyNotice />
            <button type="button" className="pay-btn" onClick={confirmPolicy}>
              확인
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
