import { describe, expect, it } from "vitest"

import { DialogCtrl } from "./dialogCtrl.ts"

describe("DialogCtrl", () => {
  it("result() resolves with the value passed to close()", async () => {
    const ctrl = new DialogCtrl<string>()

    ctrl.close("hello")

    await expect(ctrl.result()).resolves.toBe("hello")
  })

  it("result() resolves with undefined when close() is called with no arguments", async () => {
    const ctrl = new DialogCtrl<string>()

    ctrl.close()

    await expect(ctrl.result()).resolves.toBeUndefined()
  })

  it("sets store.open to true on open() and false on close()", () => {
    const ctrl = new DialogCtrl<number>()

    ctrl.open()
    expect(ctrl.store.state.open).toBe(true)

    ctrl.close(42)
    expect(ctrl.store.state.open).toBe(false)
  })

  it("result() resolves only once even if close() is called multiple times", async () => {
    const ctrl = new DialogCtrl<string>()

    ctrl.close("first")
    ctrl.close("second")

    await expect(ctrl.result()).resolves.toBe("first")
  })

  it("result() resolves with the value stored by save() when close() is called without a value", async () => {
    const ctrl = new DialogCtrl<string>()

    ctrl.save("saved")
    ctrl.close()

    await expect(ctrl.result()).resolves.toBe("saved")
  })

  it("save() followed by close(value) uses the explicit close value", async () => {
    const ctrl = new DialogCtrl<string>()

    ctrl.save("from-save")
    ctrl.close("from-close")

    await expect(ctrl.result()).resolves.toBe("from-close")
  })

  it("calling close() after close() is already called is a safe no-op", async () => {
    const ctrl = new DialogCtrl<string>()
    ctrl.save("first")
    ctrl.close()

    ctrl.close()

    await expect(ctrl.result()).resolves.toBe("first")
    expect(ctrl.store.state.open).toBe(false)
  })

  it("calling open() again before a previous open() resolves does not hang the first caller", async () => {
    const ctrl = new DialogCtrl<string>()

    const first = ctrl.open()
    const second = ctrl.open()

    ctrl.close("second-result")

    await expect(first).resolves.toBeUndefined()
    await expect(second).resolves.toBe("second-result")
  })
})
