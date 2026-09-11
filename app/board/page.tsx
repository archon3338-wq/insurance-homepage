import type { Metadata } from "next";
import BoardList from "../BoardList";
import SiteHeader from "../SiteHeader";

export const metadata: Metadata = {
  title: "게시판 | 아이리케어",
};

export default function BoardPage() {
  return (
    <>
      <SiteHeader />
      <BoardList />
    </>
  );
}
