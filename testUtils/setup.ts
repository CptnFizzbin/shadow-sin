import { setImmediate } from "node:timers"

import { cleanup } from "@testing-library/react"
import type { DetachedWindowAPI } from "happy-dom"
import { afterEach } from "vitest"

type HappyDOMWindow = Window & { happyDOM?: DetachedWindowAPI }

const flushSetImmediate = () => new Promise<void>((resolve) => setImmediate(resolve))

afterEach(async () => {
  // Unmount any mounted React trees first. Most test files already register
  // their own `afterEach(cleanup)`, but RTL's auto-cleanup runs at an
  // ambiguous point in the hook chain on some setups. Calling it explicitly
  // here makes the teardown order deterministic: unmount → drain scheduler →
  // cancel browser timers. cleanup() is a no-op if there are no trees left.
  cleanup()

  // React's scheduler queues unmount-triggered work via Node's setImmediate.
  // happy-dom tears down `window` after the test file completes; any
  // setImmediate that escapes the queue throws "window is not defined" when
  // it fires. Each flush drains the queue at this moment AND lets React
  // schedule any follow-up work (which the next flush drains). Three rounds
  // covers React 18's two-pass scheduling plus any final commit work.
  await flushSetImmediate()
  await flushSetImmediate()
  await flushSetImmediate()

  // MUI's `react-transition-group` schedules `setTimeout`-backed callbacks
  // (Dialog/Fade transitions). setImmediate flushes don't drain delayed
  // setTimeouts, so those callbacks survive teardown and throw the same
  // "window is not defined" error. `window.happyDOM.abort()` cancels pending
  // browser-scheduled async tasks (setTimeout/setInterval/requestAnimationFrame).
  const win = globalThis.window as HappyDOMWindow | undefined
  if (typeof win?.happyDOM?.abort === "function") {
    await win.happyDOM.abort()
  }
})
