import {
  createBrowserHistory,
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { StrictMode, useState } from "react"
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

    // The pop is deferred by a tick (so a same-tick remount can cancel it
    // instead of racing it — see useCloseOnBrowserBack.ts), so wait for it.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

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

  it("survives a same-tick unmount/remount (React StrictMode) without cascading back navigation", async () => {
    // StrictMode synchronously mounts, cleans up, and remounts every effect
    // once in dev. This only reproduces the original bug against a real
    // browser history: it batches pushState onto a microtask while back()
    // navigates immediately, so it's the combination that raced — a memory
    // history's push/back are both synchronous and wouldn't race here.
    window.history.pushState(null, "", "/three")
    const history = createBrowserHistory({ window })
    const router = createRouter({
      routeTree: createRootRoute({ component: TestDialog }),
      history,
    })
    render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    )
    await act(async () => {})
    // Let any deferred pop from the StrictMode "practice" unmount resolve.
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    expect(screen.getByText("open")).toBeTruthy()
    // Exactly one guard entry on top of the real route history — not walked
    // back through earlier real navigation.
    expect(history.location.pathname).toBe("/three")
    expect((history.location.state as { dialogBackGuard?: boolean }).dialogBackGuard).toBe(true)

    await act(() => {
      fireEvent.click(screen.getByRole("button", { name: "close" }))
    })
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)))

    // Closing steps back exactly one entry, landing on the real prior page.
    expect(screen.getByText("closed")).toBeTruthy()
    expect(history.location.pathname).toBe("/three")
    expect((history.location.state as { dialogBackGuard?: boolean }).dialogBackGuard).toBeUndefined()
  })
})
