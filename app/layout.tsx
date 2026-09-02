import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "무료 보험 보장분석 | 내 보장, 한눈에",
  description:
    "전화번호, 생년월일, 성별만 남겨 주시면 전문 상담사가 맞춤 보장분석을 안내해 드립니다.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
