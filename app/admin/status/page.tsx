"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SiteHeader from "../../SiteHeader";

type Row = {
  id: string;
  phone: string;
  gender: "남성" | "여성";
  status: "접수완료" | "상담대기" | "상담완료";
  createdAt: string;
};

const STATUSES: Row["status"][] = ["접수완료", "상담대기", "상담완료"];

function toLocalInput(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function fromLocalInput(value: string) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function emptyRow(): Row {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    phone: "",
    gender: "여성",
    status: "접수완료",
    createdAt: new Date().toISOString(),
  };
}

export default function AdminStatusPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("내용을 고치면 자동으로 저장됩니다.");
  const [ok, setOk] = useState(true);
  const readyRef = useRef(false);

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/lead-status", { cache: "no-store" });
    const data = (await res.json()) as {
      items?: Array<{ id: string; maskedPhone: string; gender: string; status: string; createdAt: string }>;
    };
    setItems(
      (data.items || []).map((item) => ({
        id: item.id,
        phone: item.maskedPhone,
        gender: item.gender === "남성" ? "남성" : "여성",
        status: STATUSES.includes(item.status as Row["status"])
          ? (item.status as Row["status"])
          : "접수완료",
        createdAt: item.createdAt,
      })),
    );
    setDirty(false);
    readyRef.current = true;
  }, []);

  useEffect(() => {
    loadItems().catch(() => {
      setOk(false);
      setMessage("접수현황을 불러오지 못했습니다.");
    });
  }, [loadItems]);

  const save = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/lead-status", {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            phone: item.phone,
            gender: item.gender,
            status: item.status,
            createdAt: item.createdAt,
          })),
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        items?: Array<{ id: string; maskedPhone: string }>;
      };
      if (!res.ok) {
        setOk(false);
        setMessage(data.error || "저장에 실패했습니다.");
        return;
      }
      if (data.items) {
        const phones = new Map(data.items.map((item) => [item.id, item.maskedPhone]));
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            phone: phones.get(item.id) || item.phone,
          })),
        );
      }
      setDirty(false);
      setOk(true);
      setMessage("저장했습니다. 홈 접수현황에 바로 반영됩니다.");
    } catch {
      setOk(false);
      setMessage("네트워크 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }, [items]);

  useEffect(() => {
    if (!readyRef.current || !dirty) return;
    const timer = window.setTimeout(() => {
      void save();
    }, 800);
    return () => window.clearTimeout(timer);
  }, [dirty, items, save]);

  function updateRow(id: string, patch: Partial<Row>) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setDirty(true);
  }

  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap inner-page admin-status-page">
          <p className="eyebrow">ADMIN</p>
          <h1>접수현황 관리</h1>
          <p className="intro">
            이 주소(<a href="https://www.irecare.com/admin/status">www.irecare.com/admin/status</a>)에서
            저장해야 실제 홈 접수현황에 반영됩니다. 번호를 고치면 자동으로 가려지고 저장됩니다.
          </p>
          <div className="admin-nav">
            <Link className="admin-nav-link on" href="/admin/status">
              접수현황
            </Link>
            <Link className="admin-nav-link" href="/admin">
              자료 올리기
            </Link>
          </div>

          <div className="admin-status-toolbar">
            <button type="button" className="board-write-btn" onClick={() => {
              setItems((prev) => [emptyRow(), ...prev]);
              setDirty(true);
            }}>
              새 접수 추가
            </button>
            <button type="button" className="board-ghost" onClick={() => void save()} disabled={saving}>
              {saving ? "저장 중..." : "지금 저장"}
            </button>
            <p className={`msg ${ok ? "ok" : "err"}`}>{message}</p>
          </div>

          <div className="admin-status-table-wrap">
            <table className="admin-status-table">
              <thead>
                <tr>
                  <th>핸드폰번호</th>
                  <th>성별</th>
                  <th>상태</th>
                  <th>접수시각</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="tel"
                        value={item.phone}
                        placeholder="010-1234-5678"
                        onChange={(e) => updateRow(item.id, { phone: e.target.value })}
                      />
                    </td>
                    <td>
                      <select
                        value={item.gender}
                        onChange={(e) => updateRow(item.id, { gender: e.target.value === "남성" ? "남성" : "여성" })}
                      >
                        <option value="여성">여성</option>
                        <option value="남성">남성</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) => updateRow(item.id, { status: e.target.value as Row["status"] })}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={toLocalInput(item.createdAt)}
                        onChange={(e) => updateRow(item.id, { createdAt: fromLocalInput(e.target.value) })}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => {
                          setItems((prev) => prev.filter((row) => row.id !== item.id));
                          setDirty(true);
                        }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
