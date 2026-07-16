/// <reference types="vitest/config" />
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react-swc"
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
    react({
      useAtYourOwnRisk_mutateSwcOptions(options) {
        // Workaround to enable React Compiler in SWC
        options.jsc ??= {}
        options.jsc.transform ??= {}
        options.jsc.transform.reactCompiler = true
      },
    }),
  ],

  test: {
    include: ["**/*.test.{ts,tsx}"],
    setupFiles: ["./testUtils/setup.ts"],
    environment: "happy-dom",
    // Concurrent test execution is disabled because tests using
    // `vi.useFakeTimers()` (notably `src/system/dice/diceRoller.test.ts`)
    // share a global timer mock and can interleave when run in parallel.
    sequence: {
      concurrent: false,
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/routeTree.gen.ts",
        "src/**/*.test.{ts,tsx}",
        "src/main.tsx",
        "src/env.ts",
      ],
    },
  },
})

export default config
