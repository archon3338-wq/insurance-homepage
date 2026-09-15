export const LEAD_GITHUB_REPO = "archon3338-wq/insurance-homepage";
export const LEAD_GITHUB_PATH = "data/lead-status.json";
export const LEAD_GITHUB_BRANCH = "main";
export const LEAD_GITHUB_TOKEN_KEY = "irecare-github-token";
export const LEAD_GITHUB_TOKEN_URL =
  "https://github.com/settings/tokens/new?description=irecare-status&scopes=public_repo";

const CONTENTS_URL = `https://api.github.com/repos/${LEAD_GITHUB_REPO}/contents/${LEAD_GITHUB_PATH}`;

export type LeadStatusRow = {
  id: string;
  maskedPhone: string;
  gender: string;
  status: string;
  createdAt: string;
};

function githubHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "irecare-lead-status",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function utf8ToBase64(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export function base64ToUtf8(value: string) {
  const binary = atob(value.replace(/\n/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function loadLeadStatusFromGitHub() {
  const res = await fetch(`${CONTENTS_URL}?ref=${LEAD_GITHUB_BRANCH}&t=${Date.now()}`, {
    cache: "no-store",
    headers: githubHeaders(),
  });
  if (!res.ok) throw new Error("접수현황을 불러오지 못했습니다.");
  const data = (await res.json()) as { content?: string };
  if (!data.content) throw new Error("접수현황을 불러오지 못했습니다.");
  const parsed = JSON.parse(base64ToUtf8(data.content)) as { items?: LeadStatusRow[] };
  return Array.isArray(parsed.items) ? parsed.items : [];
}

export async function saveLeadStatusToGitHub(token: string, items: LeadStatusRow[]) {
  const current = await fetch(`${CONTENTS_URL}?ref=${LEAD_GITHUB_BRANCH}`, {
    cache: "no-store",
    headers: githubHeaders(token),
  });
  if (!current.ok) {
    throw new Error("GitHub 토큰이 올바른지 확인해 주세요.");
  }
  const currentJson = (await current.json()) as { sha?: string };
  const res = await fetch(CONTENTS_URL, {
    method: "PUT",
    headers: {
      ...githubHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "update lead status",
      content: utf8ToBase64(JSON.stringify({ items }, null, 2)),
      sha: currentJson.sha,
      branch: LEAD_GITHUB_BRANCH,
    }),
  });
  if (!res.ok) {
    throw new Error("GitHub 토큰이 올바른지 확인해 주세요.");
  }
}
