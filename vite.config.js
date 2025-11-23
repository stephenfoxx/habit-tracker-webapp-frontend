import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow both localhost (dev) and your deployed frontend domain
    allowedHosts: [
      "localhost",
      "habit-tracker-webapp-16.onrender.com", 
    ],
  },
  build: {
    outDir: "dist", // default build folder
  },
});
