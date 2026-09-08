import type { Metadata } from "next";
import InfoBoard from "../InfoBoard";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "보상및정보 | 아이리케어",
};

export default function InfoPage() {
  return (
    <>
      <SiteHeader />
      <InfoBoard />
    </>
  );
}
