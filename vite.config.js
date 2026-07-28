import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  // Load env file based on mode in the current working directory.
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    // Define exposes the environment variables to the client-side code
    define: {
      "import.meta.env": {
        ...env,
        VITE_API_URL: env.VITE_API_URL,
      },
    },
  };
});
