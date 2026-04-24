/// <reference types="vitest/config" />
import path from "node:path"

import babel from "@rolldown/plugin-babel"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import dotenv from "dotenv"
import { defineConfig } from "vite"

dotenv.config({
  override: true,
  path: [
    path.resolve(__dirname, ".env"),
    path.resolve(__dirname, ".env.local"),
  ],
})

console.log(`Building ${process.env.VITE_APP_TITLE || "app"}...`)

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
    include: ["**/*.test.{ts,tsx}"],
    environment: "happy-dom",
    sequence: {
      concurrent: true,
    },
  },
})

export default config
