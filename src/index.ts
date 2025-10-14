import dotenv from "dotenv";
dotenv.config();

import { APP_CONFIG } from "./config";
import "./scheduler";

console.log(`🚀 ${process.env.APP_NAME || APP_CONFIG.name} démarré !`);
