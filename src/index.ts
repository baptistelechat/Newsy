import dotenv from "dotenv";
dotenv.config();

import { APP_CONFIG } from "./config";

import "./utils/cron/daily.cron";
import "./utils/cron/weekly.cron";

console.log(`🚀 ${process.env.APP_NAME || APP_CONFIG.name} démarré !`);
