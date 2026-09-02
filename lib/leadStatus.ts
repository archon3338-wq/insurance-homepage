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

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return "010-****-****";
  return `${digits.slice(0, 3)}-****-${digits.slice(-4)}`;
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw) as Store;
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch {
    return { items: [] };
  }
}

export async function listLeadStatus() {
  const store = await readStore();
  return store.items
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);
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
  store.items = store.items.slice(0, 30);
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2), "utf8");
  return item;
}
