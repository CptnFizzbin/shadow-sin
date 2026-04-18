/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
  },

  plugins: [
    devtools(),
    tanstackRouter({ autoCodeSplitting: true }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],

  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    environment: "happy-dom",
    sequence: {
      concurrent: true,
    },
  },
})

export default config
