import { spawn } from "node:child_process"
import { existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { createServer } from "node:net"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import type { Browser, BrowserContext, Page } from "playwright"
import { chromium, devices } from "playwright"

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..")

// Under node_modules so it is already git-ignored and wiped with a clean install.
const stateDir = join(repoRoot, "node_modules/.tmp/agent-browser")
const sessionFile = join(stateDir, "session.json")
/** Console messages and page errors from every page in the session, one per line. */
export const consoleLogFile = join(stateDir, "console.log")
const serverLogFile = join(stateDir, "server.log")

/** Options the background browser is started with. */
export interface StartOptions {
  headed: boolean
  device?: string
  baseUrl: string
  url?: string
}

/** What a running session records about itself so later commands can reattach. */
interface SessionInfo {
  pid: number
  cdpEndpoint: string
  baseUrl: string
  device?: string
  headed: boolean
}

/** A connection to the running session's browser, made by a single CLI command. */
export interface SessionConnection {
  browser: Browser
  context: BrowserContext
  page: Page
  info: SessionInfo
}

const isProcessAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

/** Returns the running session's info, or `undefined` when no browser is running. */
export const readSession = (): SessionInfo | undefined => {
  if (!existsSync(sessionFile)) return undefined
  const info = JSON.parse(readFileSync(sessionFile, "utf8")) as SessionInfo
  if (isProcessAlive(info.pid)) return info
  // The server died without cleaning up (e.g. SIGKILL), so the file is stale.
  rmSync(sessionFile, { force: true })
  return undefined
}

const knownDevices: typeof devices = {
  ...devices,
  // AGENTS.md specifies Pixel 8 screenshots at 412×915, the size Chrome DevTools emulates;
  // Playwright's descriptor subtracts browser chrome and uses 412×839.
  "Pixel 8": { ...devices["Pixel 8"], viewport: { width: 412, height: 915 } },
}

/** Throws when `deviceName` is not one of Playwright's device descriptors (e.g. "Pixel 8"). */
export const resolveDevice = (deviceName: string) => {
  const descriptor = knownDevices[deviceName]
  if (!descriptor) {
    const suggestions = Object.keys(knownDevices)
      .filter((name) => name.toLowerCase().includes(deviceName.toLowerCase().split(" ")[0]))
      .slice(0, 10)
    throw new Error(`Unknown device "${deviceName}". Similar devices: ${suggestions.join(", ") || "none"}`)
  }
  return descriptor
}

const findFreePort = () => new Promise<number>((resolvePort, reject) => {
  const server = createServer()
  server.once("error", reject)
  server.listen(0, "127.0.0.1", () => {
    const address = server.address()
    server.close(() => {
      if (address && typeof address === "object") resolvePort(address.port)
      else reject(new Error("Could not determine a free port"))
    })
  })
})

/** Resolves `url` against the session's base URL, so agents can pass app paths like `/runners`. */
export const resolveUrl = (url: string, baseUrl: string): string => new URL(url, baseUrl).toString()

/**
 * Starts the background browser server and waits until it is ready to accept commands.
 * Returns the existing session instead when one is already running.
 */
export const startSession = async (scriptPath: string, options: StartOptions): Promise<SessionInfo> => {
  const existing = readSession()
  if (existing) return existing
  if (options.device) resolveDevice(options.device)

  mkdirSync(stateDir, { recursive: true })
  rmSync(consoleLogFile, { force: true })
  const serverLog = openSync(serverLogFile, "w")

  const serveArgs = ["__serve", "--base-url", options.baseUrl]
  if (options.headed) serveArgs.push("--headed")
  if (options.device) serveArgs.push("--device", options.device)
  if (options.url) serveArgs.push("--url", options.url)

  // Reuse this process's Node flags so the child also loads TypeScript through tsx.
  const child = spawn(process.execPath, [...process.execArgv, scriptPath, ...serveArgs], {
    detached: true,
    stdio: ["ignore", serverLog, serverLog],
  })
  child.unref()

  const deadline = Date.now() + 30_000
  while (Date.now() < deadline) {
    const info = readSession()
    if (info) return info
    if (child.exitCode !== null) break
    await new Promise((wake) => setTimeout(wake, 200))
  }
  const serverOutput = existsSync(serverLogFile) ? readFileSync(serverLogFile, "utf8") : ""
  throw new Error(`Browser failed to start.\n${serverOutput}`)
}

/** Stops the running session. Returns `false` when there was nothing to stop. */
export const stopSession = async (): Promise<boolean> => {
  const info = readSession()
  if (!info) return false
  process.kill(info.pid, "SIGTERM")
  const deadline = Date.now() + 10_000
  while (Date.now() < deadline && isProcessAlive(info.pid)) {
    await new Promise((wake) => setTimeout(wake, 100))
  }
  if (isProcessAlive(info.pid)) process.kill(info.pid, "SIGKILL")
  rmSync(sessionFile, { force: true })
  return true
}

/**
 * Runs the browser in the foreground until it receives SIGTERM/SIGINT. This is the body of the
 * detached process that `startSession` spawns; it owns the browser so it outlives each CLI command.
 */
export const serveSession = async (options: StartOptions): Promise<void> => {
  const port = await findFreePort()
  const profileDir = join(stateDir, "profile")
  rmSync(profileDir, { recursive: true, force: true })

  // A persistent context is the browser's default context, which is the one a CDP client sees
  // first — so every command lands in the same context (and the same localStorage) as this one.
  const context = await chromium.launchPersistentContext(profileDir, {
    ...(options.device ? resolveDevice(options.device) : { viewport: { width: 1440, height: 900 } }),
    headless: !options.headed,
    args: [`--remote-debugging-port=${port}`],
  })

  const logLine = (line: string) => writeFileSync(consoleLogFile, `${line}\n`, { flag: "a" })
  const watchPage = (page: Page) => {
    page.on("console", (message) => logLine(`[${message.type()}] ${message.text()}`))
    page.on("pageerror", (error) => logLine(`[pageerror] ${error.message}`))
  }
  context.pages().forEach(watchPage)
  context.on("page", watchPage)

  const page = context.pages()[0] ?? await context.newPage()
  if (options.url) await page.goto(resolveUrl(options.url, options.baseUrl))

  const info: SessionInfo = {
    pid: process.pid,
    cdpEndpoint: `http://127.0.0.1:${port}`,
    baseUrl: options.baseUrl,
    device: options.device,
    headed: options.headed,
  }
  writeFileSync(sessionFile, JSON.stringify(info, null, 2))

  const shutdown = async () => {
    rmSync(sessionFile, { force: true })
    await context.close().catch(() => undefined)
    process.exit(0)
  }
  process.on("SIGTERM", shutdown)
  process.on("SIGINT", shutdown)
  context.on("close", () => {
    rmSync(sessionFile, { force: true })
    process.exit(0)
  })
}

/** Connects to the running session, failing with a hint to run `start` when none is running. */
export const connectSession = async (): Promise<SessionConnection> => {
  const info = readSession()
  if (!info) throw new Error("No browser is running. Start one with: yarn browser start")
  const browser = await chromium.connectOverCDP(info.cdpEndpoint)
  const context = browser.contexts()[0]
  const pages = context.pages()
  // The most recently opened tab is treated as the active one.
  const page = pages.at(-1) ?? await context.newPage()
  return { browser, context, page, info }
}
