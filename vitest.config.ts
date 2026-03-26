import { defineConfig } from "vitest/config"

/**
 * Vitest configuration.
 *
 * We keep this separate from vite.config.ts so that Vite's build plugins
 * (TanStack Router codegen, Babel React Compiler, etc.) do not run during
 * the test suite. The only shared concern is the `#/` path alias, which is
 * resolved via the native tsconfig-paths integration.
 *
 * The `include` pattern is intentionally restricted to `src/` so that
 * Playwright's `e2e/*.spec.ts` files are never picked up by Vitest.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
})
