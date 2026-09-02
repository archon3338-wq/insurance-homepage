import { promises as fs } from "fs";
import path from "path";

export type BojangGroup = "male" | "female";

export type BojangFile = {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  group: BojangGroup;
};

type Store = { files: BojangFile[] };

const dataPath = path.join(process.cwd(), "data", "bojang-files.json");
const uploadDir = path.join(process.cwd(), "public", "uploads", "bojang");

export function isBojangGroup(value: string): value is BojangGroup {
  return value === "male" || value === "female";
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw) as Store;
    const files: BojangFile[] = (Array.isArray(parsed.files) ? parsed.files : []).map(
      (file): BojangFile => ({
        ...file,
        group: file.group === "female" ? "female" : "male",
      })
    );
    
    return { files };
  } catch {
    return { files: [] };
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2), "utf8");
}

export async function listBojangFiles(group?: BojangGroup) {
  const store = await readStore();
  return store.files
    .filter((file) => (group ? file.group === group : true))
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function saveBojangFile(
  fileName: string,
  bytes: Buffer,
  group: BojangGroup,
) {
  const safeName = fileName.replace(/[^\w가-힣.\-() ]/g, "_");
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const savedName = `${id}-${safeName}`;

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, savedName), bytes);

  const item: BojangFile = {
    id,
    name: fileName,
    url: `/uploads/bojang/${savedName}`,
    uploadedAt: new Date().toISOString(),
    group,
  };

  const store = await readStore();
  store.files.push(item);
  await writeStore(store);
  return item;
}

export async function removeBojangFile(id: string) {
  const store = await readStore();
  const found = store.files.find((f) => f.id === id);
  if (!found) return false;

  store.files = store.files.filter((f) => f.id !== id);
  await writeStore(store);

  const filePath = path.join(process.cwd(), "public", found.url.replace(/^\//, ""));
  try {
    await fs.unlink(filePath);
  } catch {
    // ignore missing file
  }
  return true;
}
