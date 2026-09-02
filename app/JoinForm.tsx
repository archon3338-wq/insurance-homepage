"use client";

import { FormEvent, useState } from "react";

type JoinFormProps = {
  privacyHref: string;
};

export default function JoinForm({ privacyHref }: JoinFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [job, setJob] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, birthDate, job, consent }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error || "신청에 실패했습니다. 다시 시도해 주세요.");
        return;
      }

      setStatus("ok");
      setMessage("입사문의가 접수되었습니다. 확인 후 연락드리겠습니다.");
      setName("");
      setPhone("");
      setBirthDate("");
      setJob("");
      setConsent(false);
    } catch {
      setStatus("error");
      setMessage("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <form className="join-form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="join-name">성함</label>
        <input
          id="join-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="join-phone">핸드폰번호</label>
        <input
          id="join-phone"
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
        <label htmlFor="join-birth">생년월일</label>
        <input
          id="join-birth"
          name="birthDate"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="join-job">현직업</label>
        <input
          id="join-job"
          name="job"
          type="text"
          placeholder="예: 보험설계사, 회사원"
          value={job}
          onChange={(e) => setJob(e.target.value)}
          required
        />
      </div>
      <label className="consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
        />
        <span>
          입사 문의 확인을 위해 성함, 핸드폰번호, 생년월일, 현직업을 수집·이용하는 데
          동의합니다.{" "}
          <a href={privacyHref} target="_blank" rel="noreferrer">
            개인정보처리방침
          </a>
        </span>
      </label>
      <button type="submit" className="pay-btn" disabled={status === "loading"}>
        {status === "loading" ? "보내는 중..." : "입사문의 보내기"}
      </button>
      {message ? <p className={`msg ${status === "ok" ? "ok" : "err"}`}>{message}</p> : null}
    </form>
  );
}
