"use client";

import { useEffect, useState } from "react";

type Item = { id: string; name: string; url: string; uploadedAt: string };

export default function FileLibrary() {
  const [files, setFiles] = useState<Item[]>([]);

  useEffect(() => {
    fetch("/api/bojang-files")
      .then((res) => res.json())
      .then((data: { files?: Item[] }) => setFiles(data.files || []))
      .catch(() => setFiles([]));
  }, []);

  if (files.length === 0) {
    return (
      <p className="intro">
        아직 올라온 자료가 없습니다. 관리자 페이지에서 파일을 올리면 이곳에
        표시됩니다.
      </p>
    );
  }

  return (
    <div className="file-list">
      {files.map((file) => (
        <a key={file.id} className="file-item" href={file.url} target="_blank" rel="noreferrer">
          <strong>{file.name}</strong>
          <span>자료 열기</span>
        </a>
      ))}
    </div>
  );
}
