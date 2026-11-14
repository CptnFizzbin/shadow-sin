import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { createServer } from "node:http"
import type { AddressInfo } from "node:net"
import path from "node:path"

import { chromium } from "playwright"

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".png": "image/png",
}

/**
 * A Chromium to launch in place of Playwright's own build, or `undefined` to use Playwright's.
 */
function fallbackChromiumPath(): string | undefined {
  if (existsSync(chromium.executablePath())) return undefined

  // Cloud sessions preinstall one Chromium build under PLAYWRIGHT_BROWSERS_PATH, with a stable
  // `chromium` link to it. A dependency bump can move Playwright to a build that isn't there.
  const browsersPath = process.env["PLAYWRIGHT_BROWSERS_PATH"]
  const preinstalled = browsersPath ? path.join(browsersPath, "chromium") : undefined
  if (!preinstalled || !existsSync(preinstalled)) return undefined

  console.warn(`  Playwright's Chromium build isn't installed; using ${preinstalled} instead`)
  return preinstalled
}

/** Mirrors the artifact host, which never serves a page from the domain root. */
const subPath = "/artifact-smoke-test/"

export interface SmokeTestResult {
  errors: string[]
  /** Visible text of the landing page, so a caller can see the app actually rendered. */
  landingText?: string
}

/**
 * Serves `dir` under a sub-path and loads it in headless Chromium, collecting page errors and
 * failed requests.
 */
export async function smokeTest(dir: string): Promise<SmokeTestResult> {
  const server = createServer(async (request, response) => {
    const requestPath = decodeURIComponent((request.url ?? "/").split("?")[0])
    const relativePath = requestPath.startsWith(subPath) ? requestPath.slice(subPath.length) : null
    const filePath = path.join(dir, relativePath || "index.html")

    if (relativePath === null || !filePath.startsWith(dir)) {
      response.writeHead(404).end()
      return
    }

    try {
      const body = await readFile(filePath)
      response.writeHead(200, { "content-type": contentTypes[path.extname(filePath)] ?? "application/octet-stream" })
      response.end(body)
    } catch {
      response.writeHead(404).end()
    }
  })

  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve))
  const { port } = server.address() as AddressInfo
  const browser = await chromium.launch({ executablePath: fallbackChromiumPath() })
  const errors: string[] = []

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
    page.on("pageerror", (error) => errors.push(`page error: ${error.message}`))
    page.on("requestfailed", (request) => {
      const url = request.url()
      // Web fonts load from Google, which a sandboxed network may block; the app falls back fine.
      if (!url.includes("fonts.g")) errors.push(`request failed: ${url}`)
    })

    await page.goto(`http://127.0.0.1:${port}${subPath}`)
    await page.waitForFunction(
      () => (document.getElementById("root")?.childElementCount ?? 0) > 0,
      undefined,
      { timeout: 15_000 },
    ).catch(() => errors.push("the app rendered nothing into #root within 15s"))

    const landingText = (await page.textContent("#root"))?.replace(/\s+/g, " ").trim().slice(0, 160)
    return { errors, landingText }
  } finally {
    await browser.close()
    server.close()
  }
}
