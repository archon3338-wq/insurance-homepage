import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

const tokenPath = path.join(os.tmpdir(), "irecare-github-token.txt");

let memoryToken = "";

function secretKey() {
  const seed = process.env.RESEND_API_KEY || process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "irecare-lead";
  return createHash("sha256").update(`irecare-lead-write:${seed}`).digest();
}

export function readCachedGithubToken() {
  return memoryToken;
}

export async function loadCachedGithubToken() {
  if (memoryToken) return memoryToken;
  try {
    const raw = (await fs.readFile(tokenPath, "utf8")).trim();
    if (raw) memoryToken = raw;
  } catch {
    // 캐시 파일이 없으면 환경변수나 암호화된 값을 씁니다.
  }
  return memoryToken;
}

export async function cacheGithubToken(token: string) {
  const next = token.trim();
  if (!next) return;
  memoryToken = next;
  try {
    await fs.writeFile(tokenPath, next, "utf8");
  } catch {
    // 메모리에는 남겨 같은 서버에서 접수 저장에 씁니다.
  }
}

export function encryptWriteToken(token: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretKey(), iv);
  const enc = Buffer.concat([cipher.update(token, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]).toString("base64");
}

export function decryptWriteToken(payload: string) {
  const buf = Buffer.from(payload, "base64");
  if (buf.length < 29) return "";
  const decipher = createDecipheriv("aes-256-gcm", secretKey(), buf.subarray(0, 12));
  decipher.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString("utf8");
}
