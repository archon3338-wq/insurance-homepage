import { NextResponse } from "next/server";
import { Resend } from "resend";
import { addLeadStatus } from "@/lib/leadStatus";

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
      phone?: string;
      birthDate?: string;
      gender?: string;
      consent?: boolean;
    };

    const phone = normalizePhone(body.phone || "");
    const birthDate = (body.birthDate || "").trim();
    const gender = body.gender === "male" || body.gender === "female" ? body.gender : "";
    const consent = Boolean(body.consent);

    if (!PHONE_PATTERN.test(phone)) {
      return NextResponse.json(
        { error: "휴대폰 번호를 올바르게 입력해 주세요." },
        { status: 400 },
      );
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate) || !isAdult(birthDate)) {
      return NextResponse.json(
        { error: "만 19세 이상의 생년월일을 입력해 주세요." },
        { status: 400 },
      );
    }

    if (!gender) {
      return NextResponse.json(
        { error: "성별을 선택해 주세요." },
        { status: 400 },
      );
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

    const genderLabel = gender === "male" ? "남성" : "여성";
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "보장분석 신청 <beth.t@example.com>",
      to: [toEmail],
      subject: `[보장분석 신청] ${phone} / ${genderLabel}`,
      text: [
        "새로운 보장분석 상담 신청이 있습니다.",
        "",
        `전화번호: ${phone}`,
        `생년월일: ${birthDate}`,
        `성별: ${genderLabel}`,
        `동의 여부: 동의`,
        `접수 시각: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
      ].join("\n"),
    });

    if (error) {
      return NextResponse.json(
        { error: "이메일 발송에 실패했습니다. 설정을 확인해 주세요." },
        { status: 500 },
      );
    }

    try {
      await addLeadStatus(phone, genderLabel);
    } catch {
      // 메일 발송은 되었으므로 현황 저장 실패는 신청을 막지 않습니다.
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
