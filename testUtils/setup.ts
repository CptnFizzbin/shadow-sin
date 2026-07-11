import { setImmediate } from "node:timers"

import { cleanup } from "@testing-library/react"
import { afterEach } from "vitest"

const flushSetImmediate = () => new Promise<void>((resolve) => setImmediate(resolve))

afterEach(() => {
  // Clean up testing library environent
  cleanup()
})

afterEach(async () => {
  // React's scheduler queues work via Node's setImmediate. In the happy-dom
  // environment, setImmediate callbacks that fire after window teardown throw
  // "window is not defined". Awaiting multiple setImmediate cycles ensures all
  // previously-queued callbacks — including any work React schedules during
  // the first flush — have run before the environment is torn down.
  await flushSetImmediate()
  await flushSetImmediate()
})
