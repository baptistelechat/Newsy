import fs from "fs";

const FILE_PATH = "./subscribers.json";

export const loadSubscribers = (): string[] => {
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
  } catch {
    return [];
  }
};

export const saveSubscribers = (subs: string[]) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(subs, null, 2));
};
