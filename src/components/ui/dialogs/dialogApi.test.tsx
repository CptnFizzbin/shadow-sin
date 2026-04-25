import { screen, render, waitFor, cleanup } from "@testing-library/react"
import type { FC, ReactElement } from "react"
import { createElement, useEffect } from "react"
import { afterEach, describe, expect, it } from "vitest"

import type { DialogApiDialogProps } from "#/components/ui/dialogs/dialogApi.ts"
import { DialogApi } from "#/components/ui/dialogs/dialogApi.ts"
import { DialogCtrl } from "#/components/ui/dialogs/dialogCtrl.ts"
import { clearRootDialogs, RootDialogOutlet } from "#/components/ui/dialogs/rootDialogOutlet.tsx"

afterEach(() => {
  cleanup()
  clearRootDialogs()
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
 * an optional `onSubmit` callback for returning a typed value via the factory
 * overload. The wrapper always injects `open` at runtime even though it is not
 * part of `DialogApiDialogProps` — declare it here so the component can pass
 * it to a MUI-style `<Dialog open={…}>`.
 */
interface FakeDialogProps extends DialogApiDialogProps {
  open?: boolean
  onSubmit?: (value: string) => void
}

/**
 * Minimal dialog component. Simulates a close animation: calls `onClosed` via
 * `useEffect` once `open` becomes false (mirrors MUI's
 * `slotProps.transition.onExited`).
 */
const FakeStringDialog: FC<FakeDialogProps> = ({ open = true, onClose, onClosed, onSubmit }) => {
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

function renderWithOutlet(element: ReactElement) {
  return render(
    <>
      {element}
      <RootDialogOutlet />
    </>,
  )
}

describe.sequential("DialogApi", () => {
  // -------------------------------------------------------------------------
  // Component overload — result is always void
  // -------------------------------------------------------------------------
  describe("open with FC (component overload)", () => {
    it("mounts the dialog into RootDialogOutlet when open() is called", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)

      // Act
      api.open(FakeStringDialog)

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })
    })

    it("result() resolves with undefined when onClose() is called", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open(FakeStringDialog)

      // Act — wait for the dialog to appear, then click Submit (calls onClose())
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert — component overload never returns a typed value
      await expect(ctrl.result()).resolves.toBeUndefined()
    })

    it("result() resolves with undefined when ctrl.close() is called programmatically", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open(FakeStringDialog)

      // Act
      ctrl.close()

      // Assert
      await expect(ctrl.result()).resolves.toBeUndefined()
    })

    it("dialog is removed from the outlet after onClosed fires", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open(FakeStringDialog)

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
  // Factory overload — (props, ctrl) => ReactElement — typed result via save()
  // -------------------------------------------------------------------------
  describe("open with factory (factory overload)", () => {
    it("mounts the dialog into RootDialogOutlet when open() is called", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)

      // Act
      api.open<string>((props, ctrl) => (
        <FakeStringDialog {...props} onSubmit={(value) => ctrl.save(value)} />
      ))

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })
    })

    it("result() resolves with the saved value when ctrl.save() + onClose() are called", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open<string>((props, dialogCtrl) => (
        <FakeStringDialog {...props} onSubmit={(value) => dialogCtrl.save(value)} />
      ))

      // Act — wait for the dialog to appear, then click Submit
      // Submit calls onSubmit("submitted") → ctrl.save("submitted"), then onClose() → ctrl.close()
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert
      await expect(ctrl.result()).resolves.toBe("submitted")
    })

    it("result() resolves with the value passed directly to ctrl.close()", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open<string>((props, dialogCtrl) => (
        <FakeStringDialog {...props} onSubmit={(value) => dialogCtrl.save(value)} />
      ))

      // Act — programmatic close with a value (shorthand for save + close)
      ctrl.close("programmatic")

      // Assert
      await expect(ctrl.result()).resolves.toBe("programmatic")
    })

    it("dialog is removed from the outlet after onClosed fires", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open<string>((props, dialogCtrl) => (
        <FakeStringDialog {...props} onSubmit={(value) => dialogCtrl.save(value)} />
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
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open<string>((props, dialogCtrl) => (
        <FakeStringDialog {...props} onSubmit={(value) => dialogCtrl.save(value)} />
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
  // Raw element overload
  // -------------------------------------------------------------------------
  describe("open with ReactElement", () => {
    it("mounts the element into RootDialogOutlet", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const element = createElement("div", { "role": "dialog", "aria-label": "raw-dialog" })

      // Act
      api.open(element)

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "raw-dialog" })).toBeDefined()
      })
    })

    it("result() resolves with void when ctrl.close() is called", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const element = createElement("div", { "role": "dialog", "aria-label": "raw-dialog" })
      const ctrl = api.open(element)

      // Act
      ctrl.close()

      // Assert
      await expect(ctrl.result()).resolves.toBeUndefined()
    })

    it("removes the element from the outlet after ctrl.close()", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const element = createElement("div", { "role": "dialog", "aria-label": "raw-dialog" })
      const ctrl = api.open(element)

      await waitFor(() => expect(screen.getByRole("dialog", { name: "raw-dialog" })).toBeDefined())

      // Act
      ctrl.close()

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: "raw-dialog" })).toBeNull()
      })
    })
  })

  // -------------------------------------------------------------------------
  // Multi-dialog tests
  // -------------------------------------------------------------------------
  it("multiple dialogs can be open simultaneously", async () => {
    // Arrange
    const api = new DialogApi()
    renderWithOutlet(<></>)

    // Act
    api.open(FakeStringDialog)
    api.open(FakeSecondDialog)

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
    })
  })

  it("closing one dialog does not affect another", async () => {
    // Arrange
    const api = new DialogApi()
    renderWithOutlet(<></>)
    const ctrl1 = api.open(FakeStringDialog)
    api.open(FakeSecondDialog)

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
})
