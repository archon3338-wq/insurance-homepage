"use client";

import { FormEvent, useEffect, useState } from "react";
import SiteHeader from "../SiteHeader";

type Item = { id: string; name: string; url: string; group?: string };

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [group, setGroup] = useState<"male" | "female">("male");
  const [files, setFiles] = useState<Item[]>([]);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadFiles() {
    const res = await fetch("/api/admin/upload");
    const data = (await res.json()) as { files?: Item[] };
    setFiles(data.files || []);
  }

  useEffect(() => {
    loadFiles().catch(() => setFiles([]));
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setOk(false);
      setMessage("파일을 선택해 주세요.");
      return;
    }

    setLoading(true);
    setMessage("");
    const form = new FormData();
    form.append("password", password);
    form.append("group", group);
    form.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setOk(false);
        setMessage(data.error || "업로드에 실패했습니다.");
        return;
      }
      setOk(true);
      setMessage("파일을 올렸습니다. 보장분석 페이지에서 확인할 수 있습니다.");
      setFile(null);
      await loadFiles();
    } catch {
      setOk(false);
      setMessage("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function removeFile(id: string) {
    if (!password) {
      setOk(false);
      setMessage("먼저 비밀번호를 입력해 주세요.");
      return;
    }
    const res = await fetch(
      `/api/admin/upload?id=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}`,
      { method: "DELETE" },
    );
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setOk(false);
      setMessage(data.error || "삭제에 실패했습니다.");
      return;
    }
    await loadFiles();
  }

  return (
    <>
      <SiteHeader />
      <main className="section">
      <div className="wrap inner-page">
        <p className="eyebrow" style={{ color: "#c4a35a" }}>
          ADMIN
        </p>
        <h1>보장분석 자료 올리기</h1>
        <p className="intro">
          여기서 남성/여성 자료를 나눠 올릴 수 있습니다. 상단 보장분석 메뉴에서도
          같은 작업을 할 수 있습니다.
        </p>

        <form className="card" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="password">관리자 비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="ADMIN_PASSWORD"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="group">구분</label>
            <select
              id="group"
              value={group}
              onChange={(e) => setGroup(e.target.value === "female" ? "female" : "male")}
            >
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="file">파일 선택</label>
            <input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "올리는 중..." : "파일 올리기"}
          </button>
          {message ? <p className={`msg ${ok ? "ok" : "err"}`}>{message}</p> : null}
        </form>

        <div className="file-list" style={{ marginTop: 24 }}>
          {files.map((item) => (
            <div key={item.id} className="file-item">
              <a href={item.url} target="_blank" rel="noreferrer">
                <strong>{item.name}</strong>
              </a>
              <button type="button" className="text-btn" onClick={() => removeFile(item.id)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
    </>
  );
}
