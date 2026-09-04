import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.irecare.com"),

  title:"내돈내산 내보험 확인하기",
  description: "내 보험, 한눈에. I RE:CARE가 꼭 필요한 보장을 분석해드립니다.",

  openGraph: {
    title: "내돈내산 내보험 확인하기",
    description: "내 보험, 한눈에. 꼭 필요한 보장만 확인해보세요.",
    url: "https://www.irecare.com",
    siteName: "I RE:CARE",
    images: [
      {
        url: "/og-image.png",
        width: 1536,
        height: 1024,
        alt: "I RE:CARE 무료 보험 보장분석",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
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
