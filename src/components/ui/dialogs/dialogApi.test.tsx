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
})

// ---------------------------------------------------------------------------
// DialogApi.open — React integration tests
// ---------------------------------------------------------------------------

/**
 * Minimal dialog component that accepts `DialogApiDialogProps<string>`.
 * Simulates a dialog that animates out: calls `onClosed` via useEffect once
 * `open` becomes false (mirroring MUI's slotProps.transition.onExited callback).
 */
const FakeStringDialog: FC<DialogApiDialogProps<string>> = ({ open, onClose, onClosed }) => {
  useEffect(() => {
    if (!open) {
      onClosed()
    }
  }, [open, onClosed])

  if (!open) return null

  return (
    <div role="dialog" aria-label="fake-dialog">
      <button type="button" onClick={() => onClose("submitted")}>
        Submit
      </button>
    </div>
  )
}

/** Second dialog variant for multi-dialog tests. */
const FakeSecondDialog: FC<DialogApiDialogProps<string>> = ({ open, onClosed }) => {
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
  describe("open with FC", () => {
    it("mounts the dialog into RootDialogOutlet when open() is called", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)

      // Act
      api.open<string>(FakeStringDialog)

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })
    })

    it("result() resolves with the value when onClose is called", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open<string>(FakeStringDialog)

      // Act — wait for the dialog to appear, then click Submit
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert
      await expect(ctrl.result()).resolves.toBe("submitted")
    })

    it("result() resolves with the value when ctrl.close() is called programmatically", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open<string>(FakeStringDialog)

      // Act
      ctrl.close("programmatic")

      // Assert
      await expect(ctrl.result()).resolves.toBe("programmatic")
    })

    it("dialog is removed from the outlet after onClosed fires", async () => {
      // Arrange
      const api = new DialogApi()
      renderWithOutlet(<></>)
      const ctrl = api.open<string>(FakeStringDialog)

      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })

      // Act — close() sets isOpenStore=false; FakeStringDialog calls onClosed() in useEffect
      ctrl.close("done")

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
      })
    })
  })

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

  it("multiple dialogs can be open simultaneously", async () => {
    // Arrange
    const api = new DialogApi()
    renderWithOutlet(<></>)

    // Act
    api.open<string>(FakeStringDialog)
    api.open<string>(FakeSecondDialog)

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
    const ctrl1 = api.open<string>(FakeStringDialog)
    api.open<string>(FakeSecondDialog)

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
    })

    // Act
    ctrl1.close("bye")

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
    })
    expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
  })
})
