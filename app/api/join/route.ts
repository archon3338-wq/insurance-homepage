import { NextResponse } from "next/server";
import { Resend } from "resend";

const PHONE_PATTERN = /^(01[016789])-?([0-9]{3,4})-?([0-9]{4})$/;

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return value.trim();
}

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

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      birthDate?: string;
      job?: string;
      consent?: boolean;
    };

    const name = (body.name || "").trim();
    const phone = normalizePhone(body.phone || "");
    const birthDate = (body.birthDate || "").trim();
    const job = (body.job || "").trim();
    const consent = Boolean(body.consent);

    if (name.length < 2) {
      return NextResponse.json({ error: "성함을 입력해 주세요." }, { status: 400 });
    }

    if (!PHONE_PATTERN.test(phone)) {
      return NextResponse.json(
        { error: "핸드폰번호를 올바르게 입력해 주세요." },
        { status: 400 },
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || !isAdult(birthDate)) {
      return NextResponse.json(
        { error: "만 19세 이상의 생년월일을 입력해 주세요." },
        { status: 400 },
      );
    }

    if (job.length < 1) {
      return NextResponse.json({ error: "현직업을 입력해 주세요." }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json(
        { error: "개인정보 수집·이용에 동의해 주세요." },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.LEAD_EMAIL || "zoocci@naver.com";

    if (!apiKey) {
      return NextResponse.json(
        { error: "이메일 발송 설정이 아직 완료되지 않았습니다." },
        { status: 500 },
      );
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "입사문의 <beth.t@example.com>",
      to: [toEmail],
      subject: `[입사문의] ${name} / ${phone}`,
      text: [
        "새로운 입사문의가 있습니다.",
        "",
        `성함: ${name}`,
        `핸드폰번호: ${phone}`,
        `생년월일: ${birthDate}`,
        `현직업: ${job}`,
        `개인정보 수집 동의: 동의`,
        `접수 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json(
        { error: "이메일 발송에 실패했습니다. 설정을 확인해 주세요." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "잠시 후 다시 시도해 주세요." }, { status: 500 });
  }
}
