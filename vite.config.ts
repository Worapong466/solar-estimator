import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base ต้องตรงกับชื่อ repo เพราะ GitHub Pages เสิร์ฟ project site ที่ /<repo-name>/
// ใช้เฉพาะตอน build เท่านั้น ไม่กระทบ npm run dev ในเครื่อง
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/solar-estimator/" : "/",
  plugins: [react(), tailwindcss()],
}));
