import { APP_CONFIG } from "./config";

export const feeds: string[] = APP_CONFIG.defaultFeeds;

// Optionnel : fonction pour ajouter ou retirer un flux
export const addFeed = (url: string) => {
  if (!feeds.includes(url)) feeds.push(url);
};

export const removeFeed = (url: string) => {
  const index = feeds.indexOf(url);
  if (index > -1) feeds.splice(index, 1);
};
