import { createHash, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type BoardPost = {
  id: string;
  title: string;
  author: string;
  content: string;
  passwordHash: string;
  createdAt: string;
};

export type BoardPostPublic = Omit<BoardPost, "passwordHash">;
export type BoardPostSummary = Omit<BoardPostPublic, "content">;

type Store = { posts: BoardPost[] };

const dataPath = path.join(process.cwd(), "data", "board.json");
const SALT = "irecare-board-v1";

function hashPassword(password: string) {
  return createHash("sha256").update(`${SALT}:${password}`).digest("hex");
}

function verifyPassword(password: string, hash: string) {
  const next = Buffer.from(hashPassword(password));
  const prev = Buffer.from(hash);
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

function toPublic(post: BoardPost): BoardPostPublic {
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    content: post.content,
    createdAt: post.createdAt,
  };
}

function toSummary(post: BoardPost): BoardPostSummary {
  return {
    id: post.id,
    title: post.title,
    author: post.author,
    createdAt: post.createdAt,
  };
}

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw) as Store;
    return { posts: Array.isArray(parsed.posts) ? parsed.posts : [] };
  } catch {
    return { posts: [] };
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, JSON.stringify(store, null, 2), "utf8");
}

export async function listBoardPosts() {
  const store = await readStore();
  return store.posts
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(toSummary);
}

export async function getBoardPost(id: string) {
  const store = await readStore();
  const post = store.posts.find((item) => item.id === id);
  return post ? toPublic(post) : null;
}

export async function createBoardPost(input: {
  title: string;
  author: string;
  content: string;
  password: string;
}) {
  const title = input.title.trim();
  const author = input.author.trim();
  const content = input.content.trim();
  const password = input.password;

  if (title.length < 2 || title.length > 80) {
    throw new Error("제목은 2자 이상 80자 이하로 입력해 주세요.");
  }
  if (author.length < 1 || author.length > 20) {
    throw new Error("작성자 이름을 1자 이상 20자 이하로 입력해 주세요.");
  }
  if (content.length < 1 || content.length > 5000) {
    throw new Error("내용은 1자 이상 5,000자 이하로 입력해 주세요.");
  }
  if (password.length < 4 || password.length > 40) {
    throw new Error("비밀번호는 4자 이상 40자 이하로 입력해 주세요.");
  }

  const store = await readStore();
  const post: BoardPost = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    author,
    content,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  store.posts.unshift(post);
  store.posts = store.posts.slice(0, 200);
  await writeStore(store);
  return toPublic(post);
}

export async function deleteBoardPost(id: string, password: string) {
  const store = await readStore();
  const post = store.posts.find((item) => item.id === id);
  if (!post) return "missing" as const;
  if (!verifyPassword(password, post.passwordHash)) return "forbidden" as const;
  store.posts = store.posts.filter((item) => item.id !== id);
  await writeStore(store);
  return "ok" as const;
}
