import { cleanup, render, screen, waitFor } from "@testing-library/react"
import type { FC, ReactElement } from "react"
import { useEffect } from "react"
import { afterEach, describe, expect, it } from "vitest"

import { DialogApi } from "#/components/dialogs/api/dialogApi.ts"
import { DialogApiProvider } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import type { DialogApiDialogProps } from "./dialogApiDialog.ts"

afterEach(() => {
  cleanup()
})

// ---------------------------------------------------------------------------
// DialogCtrl — pure unit tests (no React)
// ---------------------------------------------------------------------------

describe("DialogCtrl", () => {
  it("result() resolves with the value passed to close()", async () => {
    // Arrange
    const dialogCtrl = new DialogCtrl<string>()

    // Act
    dialogCtrl.close("hello")

    // Assert
    await expect(dialogCtrl.result()).resolves.toBe("hello")
  })

  it("result() resolves with undefined when close() is called with no arguments", async () => {
    // Arrange
    const dialogCtrl = new DialogCtrl<string>()

    // Act
    dialogCtrl.close()

    // Assert
    await expect(dialogCtrl.result()).resolves.toBeUndefined()
  })

  it("sets store.open to false when close() is called", () => {
    // Arrange
    const dialogCtrl = new DialogCtrl<number>()
    expect(dialogCtrl.store.state.open).toBe(true)

    // Act
    dialogCtrl.close(42)

    // Assert
    expect(dialogCtrl.store.state.open).toBe(false)
  })

  it("result() resolves only once even if close() is called multiple times", async () => {
    // Arrange
    const dialogCtrl = new DialogCtrl<string>()

    // Act — close twice with different values
    dialogCtrl.close("first")
    dialogCtrl.close("second")

    // Assert — promise resolves with the first value (Promise resolves once)
    await expect(dialogCtrl.result()).resolves.toBe("first")
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

function renderWithOutlet(dialogApi: DialogApi, element: ReactElement) {
  return render(
    <DialogApiProvider dialogApi={dialogApi}>
      {element}
    </DialogApiProvider>,
  )
}

describe.sequential("DialogApi", () => {
  describe("open with FC", () => {
    it("mounts the dialog into DialogApiProvider when open() is called", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithOutlet(dialogApi, <></>)

      // Act
      dialogApi.open<string>(FakeStringDialog)

      // Assert
      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })
    })

    it("result() resolves with the value when onClose is called", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithOutlet(dialogApi, <></>)
      const dialogCtrl = dialogApi.open<string>(FakeStringDialog)

      // Act — wait for the dialog to appear, then click Submit
      await waitFor(() => screen.getByRole("button", { name: "Submit" }))
      screen.getByRole("button", { name: "Submit" }).click()

      // Assert
      await expect(dialogCtrl.result()).resolves.toBe("submitted")
    })

    it("result() resolves with the value when ctrl.close() is called programmatically", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithOutlet(dialogApi, <></>)
      const dialogCtrl = dialogApi.open<string>(FakeStringDialog)

      // Act
      dialogCtrl.close("programmatic")

      // Assert
      await expect(dialogCtrl.result()).resolves.toBe("programmatic")
    })

    it("dialog is removed from the outlet after onClosed fires", async () => {
      // Arrange
      const dialogApi = new DialogApi()
      renderWithOutlet(dialogApi, <></>)
      const dialogCtrl = dialogApi.open<string>(FakeStringDialog)

      await waitFor(() => {
        expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      })

      // Act — close() sets store.open=false; FakeStringDialog calls onClosed() in useEffect
      dialogCtrl.close("done")

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
      })
    })
  })

  it("multiple dialogs can be open simultaneously", async () => {
    // Arrange
    const dialogApi = new DialogApi()
    renderWithOutlet(dialogApi, <></>)

    // Act
    dialogApi.open<string>(FakeStringDialog)
    dialogApi.open<string>(FakeSecondDialog)

    // Assert
    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
    })
  })

  it("closing one dialog does not affect another", async () => {
    // Arrange
    const dialogApi = new DialogApi()
    renderWithOutlet(dialogApi, <></>)
    const fakeStringDialogCtrl = dialogApi.open<string>(FakeStringDialog)
    dialogApi.open<string>(FakeSecondDialog)

    await waitFor(() => {
      expect(screen.getByRole("dialog", { name: "fake-dialog" })).toBeDefined()
      expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
    })

    // Act
    fakeStringDialogCtrl.close("bye")

    // Assert
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "fake-dialog" })).toBeNull()
    })
    expect(screen.getByRole("dialog", { name: "second-dialog" })).toBeDefined()
  })
})
