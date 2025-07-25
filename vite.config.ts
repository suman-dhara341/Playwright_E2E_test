import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Optionally, make sure server settings:
  server: {
    host: "0.0.0.0", // Especially important for CI/CD and GitHub Actions
    port: 5173,
  },
});
