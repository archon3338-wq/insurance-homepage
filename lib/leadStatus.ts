import { promises as fs } from "fs";
import path from "path";

export type LeadStatusItem = {
  id: string;
  maskedPhone: string;
  gender: string;
  status: string;
  createdAt: string;
};

type Store = { items: LeadStatusItem[] };

const dataPath = path.join(process.cwd(), "data", "lead-status.json");
const GITHUB_REPO = process.env.GITHUB_REPO || "archon3338-wq/insurance-homepage";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_FILE = "data/lead-status.json";

export const LEAD_STATUSES = ["접수완료", "상담대기", "상담완료"] as const;
export type LeadStatusLabel = (typeof LEAD_STATUSES)[number];

function isLeadStatus(value: string): value is LeadStatusLabel {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return "010-***-****";
  return `${digits.slice(0, 3)}-***-*${digits.slice(-3)}`;
}

function githubToken() {
  return process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";
}

function remoteStoreUrl() {
  return (process.env.LEAD_STATUS_STORE_URL || "").trim();
}

function parseStore(data: unknown): Store | null {
  if (!data || typeof data !== "object") return null;
  const items = (data as { items?: unknown }).items;
  if (!Array.isArray(items)) return null;
  return { items: items as LeadStatusItem[] };
}

function githubHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "irecare-lead-status",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function normalizeGithubToken(token: string) {
  return token.trim().replace(/^Bearer\s+/i, "").replace(/^["']|["']$/g, "");
}

function githubWriteError(status: number) {
  if (status === 401) return "토큰이 올바르지 않습니다. 복사한 값을 다시 붙여넣어 주세요.";
  if (status === 403) return "토큰 권한이 없습니다. 토큰을 만들 때 repo 항목이 체크되어 있어야 합니다.";
  if (status === 404) return "저장소에 접근하지 못했습니다. GitHub 계정을 확인해 주세요.";
  if (status === 409) return "잠시 후 다시 지금 저장을 눌러 주세요.";
  return "저장에 실패했습니다. 토큰을 다시 확인해 주세요.";
}

async function readRemoteStore(): Promise<Store | null> {
  const url = remoteStoreUrl();
  if (!url) return null;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return parseStore(await res.json());
  } catch {
    return null;
  }
}

async function writeRemoteStore(store: Store) {
  const url = remoteStoreUrl();
  if (!url) return false;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(store),
  });
  return res.ok;
}

async function readFromGitHub(): Promise<Store | null> {
  const url = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/${GITHUB_FILE}?t=${Date.now()}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return parseStore(await res.json());
  } catch {
    return null;
  }
}

async function writeToGitHub(store: Store, token = githubToken()) {
  const writeToken = normalizeGithubToken(token);
  if (!writeToken) return false;
  const api = `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`;
  const current = await fetch(`${api}?ref=${GITHUB_BRANCH}`, {
    headers: githubHeaders(writeToken),
    cache: "no-store",
  });
  if (!current.ok) throw new Error(githubWriteError(current.status));
  const currentJson = (await current.json()) as { sha?: string };
  const content = Buffer.from(JSON.stringify(store, null, 2), "utf8").toString("base64");
  const res = await fetch(api, {
    method: "PUT",
    headers: {
      ...githubHeaders(writeToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "update lead status",
      content,
      sha: currentJson.sha,
      branch: GITHUB_BRANCH,
    }),
  });
  if (!res.ok) throw new Error(githubWriteError(res.status));
  return true;
}

async function readLocalStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return parseStore(JSON.parse(raw)) || { items: [] };
  } catch {
    return { items: [] };
  }
}

async function writeLocalStore(store: Store) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2), "utf8");
}

async function readStore(): Promise<Store> {
  const remote = await readRemoteStore();
  if (remote) return remote;
  const github = await readFromGitHub();
  if (github) return github;
  return readLocalStore();
}

async function writeStore(store: Store, token?: string) {
  const writeToken = normalizeGithubToken(token || githubToken());
  const remoteOk = await writeRemoteStore(store).catch(() => false);
  if (writeToken) {
    await writeToGitHub(store, writeToken);
    try {
      await writeLocalStore(store);
    } catch {
      // GitHub 저장이 됐으면 실제 사이트에는 반영됩니다.
    }
    return;
  }
  const githubOk = await writeToGitHub(store).catch(() => false);
  let localOk = false;
  try {
    await writeLocalStore(store);
    localOk = true;
  } catch {
    localOk = false;
  }

  if (remoteOk || githubOk) return;
  if (localOk && !process.env.VERCEL) return;
  throw new Error("GitHub 토큰을 입력하면 실제 사이트에 저장됩니다.");
}

export async function listLeadStatus() {
  const store = await readStore();
  return store.items
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((item) => ({
      ...item,
      maskedPhone: maskPhone(item.maskedPhone),
    }));
}

export async function addLeadStatus(phone: string, genderLabel: string) {
  const store = await readStore();
  const item: LeadStatusItem = {
    id: `${Date.now()}`,
    maskedPhone: maskPhone(phone),
    gender: genderLabel,
    status: "접수완료",
    createdAt: new Date().toISOString(),
  };
  store.items.unshift(item);
  store.items = store.items.slice(0, 50);
  await writeStore(store);
  return item;
}

export async function replaceLeadStatus(
  items: Array<{
    id?: string;
    phone?: string;
    maskedPhone?: string;
    gender?: string;
    status?: string;
    createdAt?: string;
  }>,
  token?: string,
) {
  const next: LeadStatusItem[] = items.slice(0, 50).map((item, index) => {
    const gender = item.gender === "남성" || item.gender === "여성" ? item.gender : "여성";
    const rawStatus = item.status || "";
    const status = isLeadStatus(rawStatus) ? rawStatus : "접수완료";
    const createdAt = item.createdAt && !Number.isNaN(new Date(item.createdAt).getTime())
      ? new Date(item.createdAt).toISOString()
      : new Date().toISOString();
    return {
      id: item.id?.trim() || `${Date.now()}-${index}`,
      maskedPhone: maskPhone(item.phone || item.maskedPhone || ""),
      gender,
      status,
      createdAt,
    };
  });

  const store = { items: next.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) };
  await writeStore(store, token);
  return store.items;
}
