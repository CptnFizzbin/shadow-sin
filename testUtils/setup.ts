import { setImmediate } from "node:timers"

import type { DetachedWindowAPI } from "happy-dom"
import { afterEach } from "vitest"

type HappyDOMWindow = Window & { happyDOM?: DetachedWindowAPI }

const flushSetImmediate = () => new Promise<void>((resolve) => setImmediate(resolve))

afterEach(async () => {
  // React's scheduler queues work via Node's setImmediate. In the happy-dom
  // environment, setImmediate callbacks that fire after window teardown throw
  // "window is not defined". Awaiting multiple setImmediate cycles ensures all
  // previously-queued callbacks — including any work React schedules during
  // the first flush — have run before the environment is torn down.
  await flushSetImmediate()
  await flushSetImmediate()

  // MUI's `react-transition-group` schedules `setTimeout`-backed callbacks
  // (Dialog/Fade transitions) that can outlive the test that opened them.
  // setImmediate flushes don't drain delayed setTimeouts, so when a later
  // test file is torn down and `window` goes away, those callbacks fire and
  // throw "window is not defined" — which Vitest reports as an unhandled
  // error and fails the run. `window.happyDOM.abort()` cancels pending
  // browser-scheduled async tasks (setTimeout/setInterval/requestAnimationFrame)
  // tied to the current window before teardown.
  const win = globalThis.window as HappyDOMWindow | undefined
  if (typeof win?.happyDOM?.abort === "function") {
    await win.happyDOM.abort()
  }
})
