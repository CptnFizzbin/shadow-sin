import { afterEach } from "vitest"

afterEach(async () => {
  // React's scheduler queues work via Node's setImmediate. In the happy-dom
  // environment, setImmediate callbacks that fire after window teardown throw
  // "window is not defined". Awaiting a setImmediate here ensures all
  // previously-queued callbacks have run before the environment is torn down.
  await new Promise<void>((resolve) => setImmediate(resolve))
})
