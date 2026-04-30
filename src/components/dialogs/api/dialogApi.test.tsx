import { screen, render, waitFor, cleanup, act } from "@testing-library/react"
import type { FC } from "react"
import { useEffect } from "react"
import { afterEach, describe, expect, it } from "vitest"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import { DialogApi } from "./dialogApi.tsx"
import { DialogApiProvider } from "./dialogApiProvider.tsx"
import type { AnyDialogCtrl } from "./dialogCtrl.ts"
import { DialogCtrl } from "./dialogCtrl.ts"

afterEach(() => {
  cleanup()
})

// ---------------------------------------------------------------------------
// DialogCtrl — pure unit tests (no React)
// ---------------------------------------------------------------------------

describe("DialogCtrl", () => {
  it("result() resolves with the value passed to close()", async () => {
    // Arrange
    const ctrl = new DialogCtrl<string>()

    // Act
    ctrl.close("hello")

    // Assert
    await expect(ctrl.result()).resolves.toBe("hello")
  })

  it("result() resolves with undefined when close() is called with no arguments", async () => {
    // Arrange
    const ctrl = new DialogCtrl<string>()

    // Act
    ctrl.close()

    // Assert
    await expect(ctrl.result()).resolves.toBeUndefined()
  })

  it("sets store.open to false when close() is called", () => {
    // Arrange
    const ctrl = new DialogCtrl<number>()
    ctrl._setOpen()
    expect(ctrl.store.state.open).toBe(true)

    // Act
    ctrl.close(42)

    // Assert
    expect(ctrl.store.state.open).toBe(false)
  })

  it("result() resolves only once even if close() is called multiple times", async () => {
    // Arrange
    const ctrl = new DialogCtrl<string>()

    // Act — close twice with different values
    ctrl.close("first")
    ctrl.close("second")

    // Assert — promise resolves with the first value (Promise resolves once)
    await expect(ctrl.result()).resolves.toBe("first")
  })

  it("result() resolves with the value stored by save() when close() is called without a value", async () => {
    // Arrange
    const ctrl = new DialogCtrl<string>()

    // Act
    ctrl.save("saved")
    ctrl.close()

    // Assert
    await expect(ctrl.result()).resolves.toBe("saved")
  })

  it("save() followed by close(value) uses the explicit close value", async () => {
    // Arrange
    const ctrl = new DialogCtrl<string>()

    // Act — close() value overrides save()
    ctrl.save("from-save")
    ctrl.close("from-close")

    // Assert
    await expect(ctrl.result()).resolves.toBe("from-close")
  })

  it("calling close() after ctrl.close() is already called is a safe no-op", async () => {
    // Arrange
    const ctrl = new DialogCtrl<string>()
    ctrl.save("first")
    ctrl.close()

    // Act — simulate onClose() being triggered again after programmatic ctrl.close()
    ctrl.close()

    // Assert — promise still resolves with the first saved value
    await expect(ctrl.result()).resolves.toBe("first")
    expect(ctrl.store.state.open).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// DialogApi.open — React integration tests
// ---------------------------------------------------------------------------

interface FakeDialogProps {
  ctrl: AnyDialogCtrl
  open?: boolean
  onSubmit?: (value: string) => void
}

/**
 * Minimal dialog component. Simulates a close animation: calls `ctrl.onClosed()` via
 * `useEffect` once `open` becomes false (mirrors MUI's
 * `slotProps.transition.onExited`).
 */
const FakeStringDialog: FC<FakeDialogProps> = ({ ctrl, open = true, onSubmit }) => {
  useEffect(() => {
    if (!open) {
      ctrl.onClosed()
    }
  }, [open, ctrl])

  if (!open) return null

  return (
    <div role="dialog" aria-label="fake-dialog">
      <button
        type="button"
        onClick={() => {
          onSubmit?.("submitted")
          ctrl.close()
        }}
      >
        Submit
      </button>
    </div>
  )
}

/** Second dialog variant for multi-dialog tests. */
const FakeSecondDialog: FC<FakeDialogProps> = ({ ctrl, open = true }) => {
  useEffect(() => {
    if (!open) ctrl.onClosed()
  }, [open, ctrl])

  if (!open) return null
  return <div role="dialog" aria-label="second-dialog" />
}

function renderWithProvider(api: DialogApi) {
  return render(
    <DialogApiProvider dialogApi={api}>
      <></>
    </DialogApiProvider>,
  )
}

describe.sequential("DialogApi", () => {
  // -------------------------------------------------------------------------
  // Factory function — typed result via ctrl.close(value)
  // -------------------------------------------------------------------------
  describe("open with factory function", () => {
    it("mounts the dialog into the provider when open() is called", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      // Act
      dialogApi.open<string>((ctrl, open) => (
        <FakeStringDialog ctrl={ctrl} open={open} />
      ))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })
    })

    it("result resolves with undefined when ctrl.close() is called via Submit", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const result = dialogApi.open<string>((ctrl, open) => (
        <FakeStringDialog ctrl={ctrl} open={open} />
      ))

      // Act — wait for the dialog to appear, then click Submit (calls ctrl.close())
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert
      await expect(result).resolves.toBeUndefined()
    })

    it("result resolves with undefined when ctrl.close() is called programmatically", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      let capturedCtrl!: DialogCtrl<string>
      const result = dialogApi.open<string>((ctrl, open) => {
        capturedCtrl = ctrl
        return <FakeStringDialog ctrl={ctrl} open={open} />
      })

      // Act
      await waitFor(() => {
        if (!capturedCtrl) throw new Error("ctrl not set")
      })
      capturedCtrl.close()

      // Assert
      await expect(result).resolves.toBeUndefined()
    })

    it("dialog is removed from the provider after onClosed fires", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      let capturedCtrl!: DialogCtrl<string>
      dialogApi.open<string>((ctrl, open) => {
        capturedCtrl = ctrl
        return <FakeStringDialog ctrl={ctrl} open={open} />
      })

      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })

      // Act — close() sets store.open=false; FakeStringDialog calls ctrl.onClosed() in useEffect
      await waitFor(() => {
        if (!capturedCtrl) throw new Error("ctrl not set")
      })
      capturedCtrl.close()

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
      })
    })

    it("result resolves with the value passed to onSubmit → ctrl.close(value)", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const result = dialogApi.open<string>((ctrl, open) => (
        <FakeStringDialog ctrl={ctrl} open={open} onSubmit={(value) => ctrl.close(value)} />
      ))

      // Act — wait for the dialog to appear, then click Submit
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert
      await expect(result).resolves.toBe("submitted")
    })

    it("result resolves with the value passed directly to ctrl.close()", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      let capturedCtrl!: DialogCtrl<string>
      const result = dialogApi.open<string>((ctrl, open) => {
        capturedCtrl = ctrl
        return <FakeStringDialog ctrl={ctrl} open={open} onSubmit={(value) => ctrl.close(value)} />
      })

      // Act — programmatic close with a value
      await waitFor(() => {
        if (!capturedCtrl) throw new Error("ctrl not set")
      })
      capturedCtrl.close("programmatic")

      // Assert
      await expect(result).resolves.toBe("programmatic")
    })

    it("calling ctrl.close() after save() then close() is already called is a safe no-op", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      let capturedCtrl!: DialogCtrl<string>
      const result = dialogApi.open<string>((ctrl, open) => {
        capturedCtrl = ctrl
        return <FakeStringDialog ctrl={ctrl} open={open} onSubmit={(value) => ctrl.close(value)} />
      })

      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      await waitFor(() => {
        if (!capturedCtrl) throw new Error("ctrl not set")
      })
      capturedCtrl.save("saved-value")
      capturedCtrl.close() // programmatic close — sets open=false, dialog begins animating out

      // Act — ctrl.close() fired again (e.g. backdrop click during animation)
      capturedCtrl.close()

      // Assert — second close is a no-op; result is still "saved-value"
      await expect(result).resolves.toBe("saved-value")
      expect(capturedCtrl.store.state.open).toBe(false)
    })
  })

  // -------------------------------------------------------------------------
  // Multi-dialog tests
  // -------------------------------------------------------------------------
  it("multiple dialogs can be open simultaneously", async () => {
    // Arrange
    const dialogApi = new DialogApi()
    renderWithProvider(dialogApi)

    // Act
    dialogApi.open<void>((ctrl, open) => <FakeStringDialog ctrl={ctrl} open={open} />)
    dialogApi.open<void>((ctrl, open) => <FakeSecondDialog ctrl={ctrl} open={open} />)

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
    })
  })

  it("closing one dialog does not affect another", async () => {
    // Arrange
    const dialogApi = new DialogApi()
    renderWithProvider(dialogApi)
    let ctrl1!: DialogCtrl<void>
    dialogApi.open<void>((ctrl, open) => {
      ctrl1 = ctrl
      return <FakeStringDialog ctrl={ctrl} open={open} />
    })
    dialogApi.open<void>((ctrl, open) => <FakeSecondDialog ctrl={ctrl} open={open} />)

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
    })

    // Act
    await waitFor(() => {
      if (!ctrl1) throw new Error("ctrl1 not set")
    })
    ctrl1.close()

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
    })
    expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
  })

  // -------------------------------------------------------------------------
  // OutOfContextError handling
  // -------------------------------------------------------------------------
  describe("OutOfContextError in dialog component", () => {
    /** A dialog that unconditionally throws OutOfContextError on render */
    const BrokenDialog: FC<{ ctrl: AnyDialogCtrl }> = () => {
      throw new OutOfContextError("useSomeContext", "SomeProvider")
    }

    it("result resolves with undefined when the dialog throws OutOfContextError", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      // Act — suppress the expected console.error from the error boundary
      const consoleError = console.error
      console.error = () => {}
      let openResult!: Promise<void | undefined>
      act(() => {
        openResult = dialogApi.open<void>((ctrl) => <BrokenDialog ctrl={ctrl} />)
      })
      console.error = consoleError

      // Assert
      await expect(openResult).resolves.toBeUndefined()
    })

    it("shows an error alert with the context name and provider name", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      // Act
      const consoleError = console.error
      console.error = () => {}
      act(() => {
        dialogApi.open<void>((ctrl) => <BrokenDialog ctrl={ctrl} />)
      })
      console.error = consoleError

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeDefined()
        expect(screen.getByText("useSomeContext")).toBeDefined()
        expect(screen.getByText("SomeProvider")).toBeDefined()
      })
    })

    it("dismissing the error alert removes the dialog entry from the store", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      const consoleError = console.error
      console.error = () => {}
      act(() => {
        dialogApi.open<void>((ctrl) => <BrokenDialog ctrl={ctrl} />)
      })
      console.error = consoleError

      await waitFor(() => expect(screen.getByRole("alert")).toBeDefined())

      // Act
      screen.getByRole("button", { name: "Dismiss" }).click()

      // Assert — alert (and dialog entry) removed from DOM
      await waitFor(() => {
        expect(screen.queryByRole("alert")).toBeNull()
      })
    })
  })
})
