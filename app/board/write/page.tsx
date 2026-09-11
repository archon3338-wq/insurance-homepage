import type { Metadata } from "next";
import BoardWrite from "../../BoardWrite";
import SiteHeader from "../../SiteHeader";

export const metadata: Metadata = {
  title: "글쓰기 | 아이리케어",
};

export default function BoardWritePage() {
  return (
    <>
      <SiteHeader />
      <BoardWrite />
    </>
  );
}
