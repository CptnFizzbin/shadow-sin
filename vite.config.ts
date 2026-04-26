/// <reference types="vitest/config" />
import babel from "@rolldown/plugin-babel"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { nodeEnv } from "./env.node.ts"

console.log(`Building ${nodeEnv.VITE_APP_TITLE}...`)

const config = defineConfig({
  server: {
    host: nodeEnv.SERVER_HOST,
    port: nodeEnv.SERVER_PORT,
  },

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
