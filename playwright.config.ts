import { defineConfig, devices } from "@playwright/test"

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
  forbidOnly: !!process.env["CI"],

  /* Retry flaky tests on CI */
  retries: process.env["CI"] ? 2 : 0,

  reporter: process.env["CI"]
    ? [
        ["html", { open: "never" }],
        ["github"],
      ]
    : [
        ["html"],
      ],
  timeout: 90000,

  use: {
    baseURL: "http://localhost:3100",
    /* Capture trace on first retry so failures are diagnosable */
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "yarn preview --port 3100",
    url: "http://localhost:3100",
    /* Reuse a running server in local dev; always start fresh on CI */
    reuseExistingServer: !process.env["CI"],
    stdout: "pipe",
    stderr: "pipe",
  },
})
