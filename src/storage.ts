import fs from "fs";
import path from "path";

// === Subscribers ===
const SUB_FILE = "./subscribers.json";

export const loadSubscribers = (): string[] => {
  try {
    return JSON.parse(fs.readFileSync(SUB_FILE, "utf8"));
  } catch {
    return [];
  }
};

export const saveSubscribers = (subs: string[]) => {
  fs.writeFileSync(SUB_FILE, JSON.stringify(subs, null, 2));
};

// === Sent articles ===
const SENT_FILE = "./sent.json";

type SentArticles = { [url: string]: boolean };

export const loadSentArticles = (): SentArticles => {
  try {
    if (!fs.existsSync(SENT_FILE)) return {};
    return JSON.parse(fs.readFileSync(SENT_FILE, "utf-8"));
  } catch (err) {
    console.error("❌ Error reading sent.json:", err);
    return {};
  }
};

export const saveSentArticles = (articles: SentArticles) => {
  try {
    fs.writeFileSync(SENT_FILE, JSON.stringify(articles, null, 2));
  } catch (err) {
    console.error("❌ Error writing sent.json:", err);
  }
};
