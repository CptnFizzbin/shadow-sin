import { act, fireEvent, render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { dialogBackGuardState } from "./dialogBackGuard.ts"
import type { DialogHistory } from "./dialogHistory.tsx"
import { DialogHistoryProvider } from "./dialogHistory.tsx"
import { useCloseOnBrowserBack } from "./useCloseOnBrowserBack.ts"

function TestDialog() {
  const [open, setOpen] = useState(true)
  useCloseOnBrowserBack(open, () => setOpen(false))
  return (
    <div>
      <span>{open ? "open" : "closed"}</span>
      <button onClick={() => setOpen(false)}>close</button>
    </div>
  )
}

function createFakeHistory() {
  const backListeners = new Set<() => void>()
  const history = {
    push: vi.fn<DialogHistory["push"]>(),
    back: vi.fn<DialogHistory["back"]>(),
    subscribeToBack: (listener: () => void) => {
      backListeners.add(listener)
      return () => {
        backListeners.delete(listener)
      }
    },
  }
  const pressBrowserBack = () => backListeners.forEach((listener) => listener())
  return { history, pressBrowserBack }
}

const renderWithHistory = (history: DialogHistory, element: ReactNode) =>
  render(<DialogHistoryProvider history={history}>{element}</DialogHistoryProvider>)

describe("useCloseOnBrowserBack", () => {
  it("pushes a guard entry while open and steps back off it on a normal close", async () => {
    // Arrange
    const { history } = createFakeHistory()
    renderWithHistory(history, <TestDialog />)

    // Act
    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: "close" }))
    })
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // Assert
    expect(history.push).toHaveBeenCalledExactlyOnceWith(dialogBackGuardState)
    expect(history.back).toHaveBeenCalledOnce()
  })

  it("closes the dialog on a back navigation without stepping back again", async () => {
    // Arrange
    const { history, pressBrowserBack } = createFakeHistory()
    renderWithHistory(history, <TestDialog />)

    // Act
    await act(() => pressBrowserBack())
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // Assert
    expect(screen.getByText("closed")).toBeTruthy()
    expect(history.back).not.toHaveBeenCalled()
  })

  it("does nothing outside a DialogHistoryProvider", () => {
    // Arrange
    const historyLength = window.history.length

    // Act
    render(<TestDialog />)

    // Assert
    expect(screen.getByText("open")).toBeTruthy()
    expect(window.history.length).toBe(historyLength)
  })
})
