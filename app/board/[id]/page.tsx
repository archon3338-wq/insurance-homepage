import type { Metadata } from "next";
import BoardPostView from "../../BoardPost";
import SiteHeader from "../../SiteHeader";

export const metadata: Metadata = {
  title: "게시판 | 아이리케어",
};

export default function BoardPostPage() {
  return (
    <>
      <SiteHeader />
      <BoardPostView />
    </>
  );
}
