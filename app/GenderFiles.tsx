"use client";

import { FormEvent, useEffect, useState } from "react";

type Item = { id: string; name: string; url: string };
type Group = "male" | "female";

export default function GenderFiles({ group }: { group: Group }) {
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<Item[]>([]);
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const label = group === "male" ? "남성" : "여성";

  async function loadFiles() {
    const res = await fetch(`/api/bojang-files?group=${group}`);
    const data = (await res.json()) as { files?: Item[] };
    setFiles(data.files || []);
  }

  useEffect(() => {
    loadFiles().catch(() => setFiles([]));
  }, [group]);

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
      setMessage(`${label} 자료가 올라갔습니다.`);
      setFile(null);
      await loadFiles();
    } catch {
      setOk(false);
      setMessage("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
          <label htmlFor="file">{label} 자료 파일</label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "올리는 중..." : `${label} 자료 올리기`}
        </button>
        {message ? <p className={`msg ${ok ? "ok" : "err"}`}>{message}</p> : null}
      </form>

      <div className="file-list" style={{ marginTop: 24 }}>
        {files.length === 0 ? (
          <p className="intro">아직 올라온 {label} 자료가 없습니다.</p>
        ) : (
          files.map((item) => (
            <a key={item.id} className="file-item" href={item.url} target="_blank" rel="noreferrer">
              <strong>{item.name}</strong>
              <span>자료 열기</span>
            </a>
          ))
        )}
      </div>
    </>
  );
}
