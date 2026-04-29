import { screen, render, waitFor, cleanup, act } from "@testing-library/react"
import type { FC } from "react"
import { useEffect } from "react"
import { afterEach, describe, expect, it } from "vitest"

import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

import { DialogApi } from "./dialogApi.ts"
import type { DialogApiDialogProps } from "./dialogApiDialog.ts"
import { DialogApiProvider } from "./dialogApiProvider.tsx"
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

  it("sets isOpenStore to false when close() is called", () => {
    // Arrange
    const ctrl = new DialogCtrl<number>()
    expect(ctrl.isOpenStore.state).toBe(true)

    // Act
    ctrl.close(42)

    // Assert
    expect(ctrl.isOpenStore.state).toBe(false)
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
    expect(ctrl.isOpenStore.state).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// DialogApi.open — React integration tests
// ---------------------------------------------------------------------------

/**
 * Props for test dialog components. Extends `DialogApiDialogProps` and adds
 * an optional `onSubmit` callback for returning a typed value.
 */
interface FakeDialogProps<TReturn = void> extends DialogApiDialogProps<TReturn> {
  onSubmit?: (value: string) => void
}

/**
 * Minimal dialog component. Simulates a close animation: calls `onClosed` via
 * `useEffect` once `open` becomes false (mirrors MUI's
 * `slotProps.transition.onExited`).
 */
const FakeStringDialog: FC<FakeDialogProps<string>> = ({ open = true, onClose, onClosed, onSubmit }) => {
  useEffect(() => {
    if (!open) {
      onClosed()
    }
  }, [open, onClosed])

  if (!open) return null

  return (
    <div role="dialog" aria-label="fake-dialog">
      <button
        type="button"
        onClick={() => {
          onSubmit?.("submitted")
          onClose()
        }}
      >
        Submit
      </button>
    </div>
  )
}

/** Second dialog variant for multi-dialog tests. */
const FakeSecondDialog: FC<FakeDialogProps> = ({ open = true, onClosed }) => {
  useEffect(() => {
    if (!open) onClosed()
  }, [open, onClosed])

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
  // Component overload — result is always void
  // -------------------------------------------------------------------------
  describe("open with FC (component overload)", () => {
    it("mounts the dialog into the provider when open() is called", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      // Act
      dialogApi.open(FakeStringDialog)

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })
    })

    it("result() resolves with undefined when onClose() is called", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const ctrl = dialogApi.open(FakeStringDialog)

      // Act — wait for the dialog to appear, then click Submit (calls onClose())
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert — component overload never returns a typed value
      await expect(ctrl.result()).resolves.toBeUndefined()
    })

    it("result() resolves with undefined when ctrl.close() is called programmatically", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const ctrl = dialogApi.open(FakeStringDialog)

      // Act
      ctrl.close()

      // Assert
      await expect(ctrl.result()).resolves.toBeUndefined()
    })

    it("dialog is removed from the provider after onClosed fires", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const ctrl = dialogApi.open(FakeStringDialog)

      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })

      // Act — close() sets isOpenStore=false; FakeStringDialog calls onClosed() in useEffect
      ctrl.close()

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
      })
    })
  })

  // -------------------------------------------------------------------------
  // Render function overload — typed result via onClose(value)
  // -------------------------------------------------------------------------
  describe("open with render function", () => {
    it("mounts the dialog into the provider when open() is called", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      // Act
      dialogApi.open<string>((props) => (
        <FakeStringDialog {...props} onSubmit={(value) => props.onClose(value)} />
      ))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })
    })

    it("result() resolves with the value passed to onClose()", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const ctrl = dialogApi.open<string>((props) => (
        <FakeStringDialog {...props} onSubmit={(value) => props.onClose(value)} />
      ))

      // Act — wait for the dialog to appear, then click Submit
      // Submit calls onSubmit("submitted") → props.onClose("submitted") → ctrl resolves
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert
      await expect(ctrl.result()).resolves.toBe("submitted")
    })

    it("result() resolves with the value passed directly to ctrl.close()", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const ctrl = dialogApi.open<string>((props) => (
        <FakeStringDialog {...props} onSubmit={(value) => props.onClose(value)} />
      ))

      // Act — programmatic close with a value
      ctrl.close("programmatic")

      // Assert
      await expect(ctrl.result()).resolves.toBe("programmatic")
    })

    it("dialog is removed from the provider after onClosed fires", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const ctrl = dialogApi.open<string>((props) => (
        <FakeStringDialog {...props} onSubmit={(value) => props.onClose(value)} />
      ))

      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })

      // Act
      ctrl.close()

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
      })
    })

    it("calling onClose() after ctrl.close() is already called is a safe no-op", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)
      const ctrl = dialogApi.open<string>((props) => (
        <FakeStringDialog {...props} onSubmit={(value) => props.onClose(value)} />
      ))

      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      ctrl.save("saved-value")
      ctrl.close() // programmatic close — sets open=false, dialog begins animating out

      // Act — onClose() fired again (e.g. backdrop click during animation)
      ctrl.close()

      // Assert — second close is a no-op; result is still "saved-value"
      await expect(ctrl.result()).resolves.toBe("saved-value")
      expect(ctrl.isOpenStore.state).toBe(false)
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
    dialogApi.open(FakeStringDialog)
    dialogApi.open(FakeSecondDialog)

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
    const ctrl1 = dialogApi.open(FakeStringDialog)
    dialogApi.open(FakeSecondDialog)

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
    })

    // Act
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
    const BrokenDialog: FC<DialogApiDialogProps> = () => {
      throw new OutOfContextError("useSomeContext", "SomeProvider")
    }

    it("result() resolves with undefined when the dialog throws OutOfContextError", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      // Act — suppress the expected console.error from the error boundary
      const consoleError = console.error
      console.error = () => {}
      let ctrl!: DialogCtrl<void>
      act(() => {
        ctrl = dialogApi.open(BrokenDialog)
      })
      console.error = consoleError

      // Assert
      await expect(ctrl.result()).resolves.toBeUndefined()
    })

    it("shows an error alert with the context name and provider name", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithProvider(dialogApi)

      // Act
      const consoleError = console.error
      console.error = () => {}
      act(() => {
        dialogApi.open(BrokenDialog)
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
        dialogApi.open(BrokenDialog)
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
