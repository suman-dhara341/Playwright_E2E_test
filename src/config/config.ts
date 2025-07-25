// src/config/config.ts

// Load environment variables for Node.js contexts (including Playwright)
if (typeof process !== "undefined" && typeof window === "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("dotenv").config();
  } catch (e) {
    console.warn("dotenv not loaded (probably not in Node)");
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
    userUrl: "http://localhost:5173",
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

const rawStage =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_STAGE_NAME
    ? import.meta.env.VITE_STAGE_NAME
    : process.env.VITE_STAGE_NAME || "local";

const stage = rawStage as StageName;

if (!stage || !(stage in configData)) {
  throw new Error(`❌ Invalid or missing VITE_STAGE_NAME: ${stage}`);
}

export const EnvConfig = configData[stage];
