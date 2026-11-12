import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { Command, Option } from "commander"
import type { BrowserContext, Page } from "playwright"

import type { SessionConnection } from "./browserSession.ts"
import {
  connectSession,
  consoleLogFile,
  readSession,
  resolveDevice,
  resolveUrl,
  serveSession,
  startSession,
  stopSession,
} from "./browserSession.ts"

const scriptPath = fileURLToPath(import.meta.url)
const defaultBaseUrl = "http://localhost:3000"
const defaultTimeoutMs = 10_000

/**
 * Runs `action` against the running session's active page, then detaches without closing the
 * browser. Errors are printed and turned into a non-zero exit code.
 */
const withPage = (action: (session: SessionConnection) => Promise<void>) => async () => {
  const session = await connectSession()
  session.page.setDefaultTimeout(defaultTimeoutMs)
  try {
    await action(session)
  } finally {
    // Closing a CDP-attached browser only drops this connection; the browser keeps running.
    await session.browser.close()
  }
}

const printLocation = async ({ page }: SessionConnection) => {
  console.log(`${page.url()} — ${await page.title()}`)
}

// A CDP-attached client didn't set the viewport itself, so Playwright reports it as null.
const measureViewport = async (page: Page) => page.viewportSize()
  ?? await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }))

/** Returns the cookies plus the active page's localStorage, in Playwright's storage-state shape. */
const captureStorageState = async (context: BrowserContext, page: Page) => {
  // The app debounces localStorage writes and flushes them on beforeunload, so fire it first
  // or the copy can miss recent changes.
  const localStorageEntries = await page.evaluate(() => {
    window.dispatchEvent(new Event("beforeunload"))
    return Object.entries(localStorage).map(([name, value]) => ({ name, value }))
  })
  // context.storageState() returns no localStorage when attached over CDP, so read it directly.
  return {
    cookies: await context.cookies(),
    origins: [{ origin: new URL(page.url()).origin, localStorage: localStorageEntries }],
  }
}

const ensureParentDir = (filePath: string) => mkdirSync(dirname(filePath), { recursive: true })

const program = new Command()
  .name("yarn browser")
  .description(
    "Drive a persistent headless Chromium for agents. Run `start` once, then issue commands; "
    + "each command acts on the active (most recent) tab and leaves the browser running.\n\n"
    + "Selectors are Playwright selectors: CSS (`button.save`), text (`text=Save`), "
    + "role (`role=button[name=\"Save\"]`), test id (`data-testid=save`), etc.",
  )
  .showHelpAfterError()

program.command("start")
  .description("Start the background browser (no-op if one is already running)")
  .argument("[url]", "URL or app path to open once started")
  .option("--headed", "Show the browser window instead of running headless", false)
  .option("--device <name>", "Emulate a Playwright device for the whole session, e.g. \"Pixel 8\"")
  .option("--base-url <url>", "Base URL that app paths like /runners resolve against", defaultBaseUrl)
  .action(async (url: string | undefined, options: { headed: boolean, device?: string, baseUrl: string }) => {
    const alreadyRunning = readSession()
    const info = await startSession(scriptPath, { ...options, url })
    if (alreadyRunning) console.log(`Browser already running (pid ${info.pid}); options ignored.`)
    else console.log(`Browser started (pid ${info.pid}, ${info.device ?? "desktop 1440×900"}).`)
  })

program.command("__serve", { hidden: true })
  .option("--headed", "", false)
  .option("--device <name>")
  .option("--url <url>")
  .requiredOption("--base-url <url>")
  .action(async (options: { headed: boolean, device?: string, url?: string, baseUrl: string }) => {
    await serveSession(options)
  })

program.command("stop")
  .description("Stop the background browser")
  .action(async () => {
    console.log(await stopSession() ? "Browser stopped." : "No browser was running.")
  })

program.command("status")
  .description("Show whether a browser is running and which pages it has open")
  .action(async () => {
    if (!readSession()) {
      console.log("No browser is running.")
      return
    }
    await withPage(async ({ context, page, info }) => {
      console.log(`Running (pid ${info.pid}, ${info.device ?? "desktop"}, base URL ${info.baseUrl})`)
      for (const [index, openPage] of context.pages().entries()) {
        const marker = openPage === page ? "*" : " "
        console.log(`${marker} [${index}] ${openPage.url()} — ${await openPage.title()}`)
      }
    })()
  })

program.command("open")
  .alias("goto")
  .description("Navigate the active tab to a URL or app path (e.g. /runners)")
  .argument("<url>", "Absolute URL, or a path resolved against the base URL")
  .action((url: string) => withPage(async (session) => {
    await session.page.goto(resolveUrl(url, session.info.baseUrl))
    await printLocation(session)
  })())

program.command("reload")
  .description("Reload the active tab")
  .action(withPage(async (session) => {
    await session.page.reload()
    await printLocation(session)
  }))

program.command("back")
  .description("Go back in the active tab's history")
  .action(withPage(async (session) => {
    await session.page.goBack()
    await printLocation(session)
  }))

program.command("click")
  .description("Click the element matching a selector")
  .argument("<selector>")
  .action((selector: string) => withPage(async (session) => {
    await session.page.locator(selector).click()
    await printLocation(session)
  })())

program.command("fill")
  .description("Replace the value of an input/textarea matching a selector")
  .argument("<selector>")
  .argument("<value>")
  .action((selector: string, value: string) => withPage(async ({ page }) => {
    await page.locator(selector).fill(value)
  })())

program.command("select")
  .description("Choose an option (by value or label) in a native <select>")
  .argument("<selector>")
  .argument("<option>")
  .action((selector: string, option: string) => withPage(async ({ page }) => {
    await page.locator(selector).selectOption(option)
  })())

program.command("press")
  .description("Press a key (e.g. Enter, Escape, Control+A), optionally focused on an element")
  .argument("<key>")
  .option("-s, --selector <selector>", "Element to press the key on")
  .action((key: string, options: { selector?: string }) => withPage(async ({ page }) => {
    if (options.selector) await page.locator(options.selector).press(key)
    else await page.keyboard.press(key)
  })())

program.command("wait")
  .description("Wait for an element to reach a state")
  .argument("<selector>")
  .addOption(new Option("--state <state>", "State to wait for")
    .choices(["visible", "hidden", "attached", "detached"]).default("visible"))
  .option("--timeout <ms>", "Give up after this many milliseconds", String(defaultTimeoutMs))
  .action((selector: string, options: { state: "visible" | "hidden" | "attached" | "detached", timeout: string }) =>
    withPage(async ({ page }) => {
      await page.locator(selector).first().waitFor({ state: options.state, timeout: Number(options.timeout) })
      console.log(`${selector} is ${options.state}`)
    })())

program.command("text")
  .description("Print the visible text of the page or of the elements matching a selector")
  .argument("[selector]", "Elements to read", "body")
  .action((selector: string) => withPage(async ({ page }) => {
    const texts = await page.locator(selector).allInnerTexts()
    console.log(texts.join("\n---\n"))
  })())

program.command("snapshot")
  .description("Print an ARIA (accessibility tree) snapshot — the best way to discover selectors")
  .argument("[selector]", "Element to snapshot", "body")
  .action((selector: string) => withPage(async ({ page }) => {
    console.log(await page.locator(selector).first().ariaSnapshot())
  })())

program.command("eval")
  .description("Evaluate a JavaScript expression in the page and print the JSON result")
  .argument("<expression>", "e.g. \"document.title\" or \"localStorage.length\"")
  .action((expression: string) => withPage(async ({ page }) => {
    // Wrapping in an async IIFE lets agents pass bare expressions, including ones using `await`.
    const result: unknown = await page.evaluate(`(async () => (${expression}))()`)
    console.log(JSON.stringify(result, null, 2) ?? "undefined")
  })())

program.command("screenshot")
  .description("Save a PNG of the active tab, an element, or the page on an emulated device")
  .argument("<file>", "Output path, e.g. screenshots/runner.png (relative to the current directory)")
  .option("-s, --selector <selector>", "Capture only this element")
  .option("--full-page", "Capture the whole scrollable page", false)
  .option("--device <name>",
    "Capture the current URL on an emulated device (e.g. \"Pixel 8\"), sharing the session's storage")
  .option("--scale <factor>", "Device scale factor for desktop captures (devices use their own)", "1")
  .action((file: string, options: { selector?: string, fullPage: boolean, device?: string, scale: string }) =>
    withPage(async ({ browser, context, page }) => {
      const outputPath = resolve(file)
      ensureParentDir(outputPath)

      let target = page
      let cleanup = async () => {}
      if (options.device || options.scale !== "1") {
        // Viewport and scale are fixed per browser context, so render the same URL in a throwaway
        // context seeded with the session's cookies and localStorage (where Runners are stored).
        const deviceContext = await browser.newContext({
          ...(options.device
            ? resolveDevice(options.device)
            : { viewport: await measureViewport(page), deviceScaleFactor: Number(options.scale) }),
          storageState: await captureStorageState(context, page),
        })
        target = await deviceContext.newPage()
        target.setDefaultTimeout(defaultTimeoutMs)
        await target.goto(page.url())
        await target.waitForLoadState("networkidle")
        cleanup = () => deviceContext.close()
      }

      try {
        if (options.selector) await target.locator(options.selector).first().screenshot({ path: outputPath })
        else await target.screenshot({ path: outputPath, fullPage: options.fullPage })
        console.log(`Saved ${outputPath}`)
      } finally {
        await cleanup()
      }
    })())

program.command("viewport")
  .description("Resize the active tab's viewport")
  .argument("<width>")
  .argument("<height>")
  .action((width: string, height: string) => withPage(async ({ page }) => {
    await page.setViewportSize({ width: Number(width), height: Number(height) })
    console.log(`Viewport set to ${width}×${height}`)
  })())

program.command("console")
  .description("Print console messages and page errors captured since the browser started")
  .option("-n, --tail <lines>", "Only print the last N lines")
  .option("--clear", "Clear the log after printing", false)
  .action((options: { tail?: string, clear: boolean }) => {
    const lines = existsSync(consoleLogFile)
      ? readFileSync(consoleLogFile, "utf8").split("\n").filter(Boolean)
      : []
    const shown = options.tail ? lines.slice(-Number(options.tail)) : lines
    console.log(shown.length ? shown.join("\n") : "(no console output)")
    if (options.clear) rmSync(consoleLogFile, { force: true })
  })

try {
  await program.parseAsync()
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
