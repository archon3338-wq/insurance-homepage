"use client";

import { FormEvent, useState } from "react";

type LeadFormProps = {
  submitClassName?: string;
  onSuccess?: () => void;
};

export default function LeadForm({ submitClassName, onSuccess }: LeadFormProps) {
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, birthDate, gender, consent }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "신청에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      setStatus("ok");
      setMessage("신청이 완료되었습니다. 영업일 기준 빠르게 연락드리겠습니다.");
      setPhone("");
      setBirthDate("");
      setGender("");
      setConsent(false);
      onSuccess?.();
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <form id="apply" className="card" onSubmit={onSubmit}>
      <h2>무료 보장분석 신청</h2>
      <p className="sub">남겨 주신 번호로 상담 전화를 드립니다.</p>

      <div className="field">
        <label htmlFor="phone">전화번호</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-1234-5678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="birthDate">생년월일</label>
        <input
          id="birthDate"
          name="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="gender">성별</label>
        <select
          id="gender"
          name="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">선택해 주세요</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </div>

      <label className="consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          상담을 위해 전화번호, 생년월일, 성별을 수집·이용하는 데 동의합니다.
          (동의 철회 시 상담이 어려울 수 있습니다)
        </span>
      </label>

      <button
        type="submit"
        className={submitClassName}
        disabled={status === "loading"}
      >
        {status === "loading" ? "신청 중..." : "무료 상담 신청하기"}
      </button>

      {message ? (
        <p className={`msg ${status === "ok" ? "ok" : "err"}`}>{message}</p>
      ) : null}
    </form>
  );
}
