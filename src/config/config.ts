// src/config/config.ts

// ✅ Load dotenv only in Node.js (not Vite/browser)
if (typeof process !== "undefined" && typeof window === "undefined") {
  try {
    // Load only if not already loaded (useful for CI)
    if (!process.env.VITE_STAGE_NAME) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("dotenv").config();
      console.log("✅ dotenv loaded");
    }
  } catch (e) {
    console.warn("⚠️ dotenv not loaded (likely outside Node.js)");
  }
}

type StageName = "local" | "alpha" | "prod";

type ConfigSchema = Record<
  StageName,
  {
    apiUrl: string;
    userUrl: string;
    adminUrl: string;
  }
>;

const configData: ConfigSchema = {
  local: {
    apiUrl: "https://ln2npaai4i.execute-api.us-east-1.amazonaws.com/alpha",
    userUrl: "http://localhost:5173", // 👈 use 5173 for dev (`npm run dev`)
    adminUrl: "http://localhost:3000",
  },
  alpha: {
    apiUrl: "https://ln2npaai4i.execute-api.us-east-1.amazonaws.com/alpha",
    userUrl: "https://main.d1vos4qfjhiyoz.amplifyapp.com",
    adminUrl: "https://main.d2amgi1rm0yth4.amplifyapp.com",
  },
  prod: {
    apiUrl: "https://pcj8zmeleh.execute-api.us-east-1.amazonaws.com/prod",
    userUrl: "https://app.us.prod.wazopulse.com",
    adminUrl: "https://admin.app.us.prod.wazopulse.com",
  },
};

// 🧠 Read from `VITE_STAGE_NAME` (fallback to 'local')
const rawStage =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_STAGE_NAME) ||
  process.env.VITE_STAGE_NAME ||
  "local";

const stage = rawStage as StageName;

if (!(stage in configData)) {
  throw new Error(`❌ Invalid VITE_STAGE_NAME: ${stage}`);
}

// ✅ Export config based on environment
export const EnvConfig = configData[stage];
