import type { Metadata } from "next";
import PrivacyPolicy from "../PrivacyPolicy";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap">
          <PrivacyPolicy />
        </div>
      </main>
    </>
  );
}
