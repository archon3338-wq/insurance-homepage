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
