import fs from "fs";
import { Article } from "../../types/Article";

const SENT_FILE = "./sent.json";
const MAX_AGE_DAYS = 21;

export interface SentArticles {
  [link: string]: Article;
}

// Nettoyage automatique
const cleanOldSentArticles = (articles: SentArticles): SentArticles => {
  const cleaned: SentArticles = {};
  const now = new Date();

  for (const [link, info] of Object.entries(articles)) {
    if (!info.pubDate) continue;

    const sentDate = new Date(info.pubDate);
    const ageDays =
      (now.getTime() - sentDate.getTime()) / (1000 * 60 * 60 * 24);

    if (ageDays <= MAX_AGE_DAYS) {
      cleaned[link] = info;
    }
  }

  return cleaned;
};

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
    const cleaned = cleanOldSentArticles(articles); // nettoyage automatique
    fs.writeFileSync(SENT_FILE, JSON.stringify(cleaned, null, 2));
  } catch (err) {
    console.error("❌ Error writing sent.json:", err);
  }
};
