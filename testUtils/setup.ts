import { setImmediate } from "node:timers"

import { cleanup } from "@testing-library/react"
import { Storage } from "happy-dom"
import { afterEach } from "vitest"

const flushSetImmediate = () => new Promise<void>((resolve) => setImmediate(resolve))

// Node's native `globalThis.localStorage`/`sessionStorage` (stable since Node 25) shadow
// happy-dom's own implementations: vitest's environment patching only overrides globals the
// real Node global object doesn't already define, and Node's versions require
// `--localstorage-file` to actually work. Without it, every access throws and prints
// "Warning: --localstorage-file was provided without a valid path" (e.g. from MUI's
// CssVarsProvider persisting the color scheme). Force happy-dom's real, working Storage.
for (const key of ["localStorage", "sessionStorage"] as const) {
  Object.defineProperty(globalThis, key, {
    value: new Storage(),
    configurable: true,
    writable: true,
  })
}

afterEach(() => {
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
