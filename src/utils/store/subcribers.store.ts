import fs from "fs";

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
