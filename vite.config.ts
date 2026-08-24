/// <reference types="vitest/config" />
import { execFileSync } from "node:child_process"

import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

import { nodeEnv } from "./env.node.ts"

console.log(`Building ${nodeEnv.VITE_APP_TITLE}...`)

/**
 * The app's version: the timestamp of the latest commit on the current branch for a production
 * build, or this process's start time for the dev server — see `src/data/appVersion.ts`. Falls
 * back to the process start time if `git log` fails (e.g. a source archive with no `.git` dir).
 */
function resolveAppVersion(command: "build" | "serve"): string {
  if (command === "serve") {
    return new Date().toISOString()
  }

  try {
    return execFileSync("git", ["log", "-1", "--format=%cI"]).toString().trim()
  } catch {
    return new Date().toISOString()
  }
}

const config = defineConfig(({ command }) => ({
  define: {
    __APP_VERSION__: JSON.stringify(resolveAppVersion(command)),
  },

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

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Runner migrations (src/data/migrations.ts, statically imported — no top-level await)
          // always need to load and run together, so keep them in one dedicated chunk instead of
          // wherever Rollup's default chunking happens to put them.
          if (id.includes("/src/data/migrations")) {
            return "runner-migrations"
          }

          // Group third-party deps by npm scope (e.g. all of @mui/* in one "vendor-mui" chunk)
          // instead of Vite's default one-chunk-per-package or one giant omnibus vendor chunk.
          // Unscoped packages (react, immer, zod, ...) share a single "vendor" chunk.
          const scopedMatch = id.match(/\/node_modules\/(@[^/]+)\/[^/]+\//)
          if (scopedMatch) {
            return `vendor-${scopedMatch[1].slice(1)}`
          }
          if (id.includes("/node_modules/")) {
            return "vendor"
          }
        },
      },
    },
  },

  test: {
    include: ["**/*.test.{ts,tsx}"],
    setupFiles: ["./testUtils/setup.ts"],
    environment: "happy-dom",
    // Concurrent execution is opt-in per suite (`describe.concurrent`) rather than the file-wide
    // default, because most `*.test.tsx` component tests render via `@testing-library/react`:
    // its `screen` queries and `cleanup()` (`testUtils/renderUtils.tsx`) act on the single shared
    // `document`, so two such tests interleaving would see (and tear down) each other's DOM.
    // Suites are opted in only once confirmed to hold no state across `it` blocks — see AGENTS.md
    // for the criteria. Left sequential for the same reason: any suite using `vi.useFakeTimers()`
    // (they share one global timer mock, e.g. `src/system/dice/diceRoller.test.ts`) and
    // `src/components/ui/dialog/openOverlayTracker.test.ts`, whose tests intentionally chain off
    // the module-level counter under test.
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
}))

export default config
