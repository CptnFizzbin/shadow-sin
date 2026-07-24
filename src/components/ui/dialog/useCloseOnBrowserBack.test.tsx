import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { useState } from "react"
import { describe, expect, it } from "vitest"

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

function renderTestDialog() {
  const history = createMemoryHistory({ initialEntries: ["/"] })
  const router = createRouter({ routeTree: createRootRoute({ component: TestDialog }), history })
  render(<RouterProvider router={router} />)
  return { router, history }
}

describe("useCloseOnBrowserBack", () => {
  it("pushes a history entry while open and pops it again on normal close", async () => {
    const { history } = renderTestDialog()
    await act(async () => {})

    // Opening the dialog pushed a new (marked) history entry on top.
    expect(history.length).toBeGreaterThan(1)
    expect((history.location.state as { dialogBackGuard?: boolean }).dialogBackGuard).toBe(true)

    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: "close" }))
    })

    // Closing by another means (not the back button) steps back off that
    // entry again rather than leaving it in history.
    expect(screen.getByText("closed")).toBeTruthy()
    expect((history.location.state as { dialogBackGuard?: boolean }).dialogBackGuard).toBeUndefined()
  })

  it("closes the dialog when the browser back button is pressed", async () => {
    const { router } = renderTestDialog()
    await act(async () => {})

    expect(screen.getByText("open")).toBeTruthy()

    await act(() => {
      router.history.back()
    })

    expect(screen.getByText("closed")).toBeTruthy()
  })

  it("does not intercept back when onClose is undefined", async () => {
    function NonDismissableDialog() {
      useCloseOnBrowserBack(true, undefined)
      return <span>open</span>
    }

    const history = createMemoryHistory({ initialEntries: ["/"] })
    const router = createRouter({
      routeTree: createRootRoute({ component: NonDismissableDialog }),
      history,
    })
    render(<RouterProvider router={router} />)
    await act(async () => {})

    expect(history.length).toBe(1)
  })
})
