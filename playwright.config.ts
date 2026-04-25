import { defineConfig, devices } from "@playwright/test"

import { nodeEnv } from "./env.node.ts"

/**
 * ShadowSIN uses hash-based routing (createHashHistory), so all route paths
 * are expressed as URL hash fragments, e.g. /#/new.
 * The baseURL points at the Vite dev server; Playwright's webServer directive
 * starts it automatically before the test run.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,

  /* Fail the build on CI if test.only is accidentally committed */
  forbidOnly: nodeEnv.CI,

  /* Retry flaky tests on CI */
  retries: nodeEnv.CI ? 2 : 0,

  reporter: nodeEnv.CI
    ? [
        ["html", { open: "never" }],
        ["github"],
      ]
    : [
        ["html"],
      ],
  timeout: 90000,

  use: {
    baseURL: nodeEnv.SERVER_URL,
    /* Capture trace on first retry so failures are diagnosable */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 480, height: 880 } },
    },
  ],

  webServer: {
    command: `yarn preview --port ${nodeEnv.SERVER_PORT}`,
    url: nodeEnv.SERVER_URL,
    /* Reuse a running server in local dev; always start fresh on CI */
    reuseExistingServer: !nodeEnv.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
})
