import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DialogCtrl } from "#/services/dialog/dialogCtrl.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ManageKarmaDialog } from "./manageKarmaDialog.tsx"

function renderDialog({ karma = 10, total = 20, nuyen = 0 } = {}) {
  const ctrl = new DialogCtrl<void>()
  ctrl.open()
  const store = renderWithProviders(<ManageKarmaDialog ctrl={ctrl} />, {
    runner: runnerDataFactory({ afterBuild: (sheet) => {
      sheet.karma.current = karma
      sheet.karma.total = total
      sheet.nuyen.current = nuyen
    } }),
  })
  return { ctrl, store }
}

const setCounter = (label: RegExp, value: number) => {
  fireEvent.change(screen.getByRole("textbox", { name: label }), { target: { value: String(value) } })
}

describe("ManageKarmaDialog", () => {
  it("opens on a menu of every karma workflow", () => {
    // Arrange / Act
    renderDialog()

    // Assert
    for (const label of [/earn karma/i, /buy karma/i, /spend karma/i, /sell karma/i, /edit karma/i]) {
      expect(screen.getByRole("button", { name: label })).toBeTruthy()
    }
  })

  it("returns to the menu from a workflow via the back button", () => {
    // Arrange
    renderDialog()
    fireEvent.click(screen.getByRole("button", { name: /earn karma/i }))

    // Act
    fireEvent.click(screen.getByRole("button", { name: /back to options/i }))

    // Assert
    expect(screen.getByRole("button", { name: /sell karma/i })).toBeTruthy()
  })

  it("buys karma with nuyen at the Table's rate without raising total earned", async () => {
    // Arrange
    const { store } = renderDialog({ karma: 10, total: 20, nuyen: 12000 })
    fireEvent.click(screen.getByRole("button", { name: /buy karma/i }))

    // Act
    setCounter(/karma/i, 2)
    fireEvent.click(screen.getByRole("button", { name: /^buy$/i }))

    // Assert
    await waitFor(() => expect(store.getState().runner.karma.current).toBe(12))
    expect(store.getState().runner.karma.total).toBe(20)
    expect(store.getState().runner.nuyen.current).toBe(2000)
  })

  it("disables Buy when the Runner can't afford the karma", () => {
    // Arrange
    renderDialog({ nuyen: 4999 })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /buy karma/i }))

    // Assert
    expect((screen.getByRole("button", { name: /^buy$/i }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText(/not enough nuyen/i)).toBeTruthy()
  })

  it("sells karma for nuyen at the Table's rate", async () => {
    // Arrange
    const { store } = renderDialog({ karma: 10, total: 20, nuyen: 100 })
    fireEvent.click(screen.getByRole("button", { name: /sell karma/i }))

    // Act
    setCounter(/karma/i, 3)
    fireEvent.click(screen.getByRole("button", { name: /^sell$/i }))

    // Assert
    await waitFor(() => expect(store.getState().runner.karma.current).toBe(7))
    expect(store.getState().runner.karma.total).toBe(20)
    expect(store.getState().runner.nuyen.current).toBe(7600)
  })

  it("sells karma for nuyen even while the Runner's nuyen is negative", async () => {
    // Arrange
    const { store } = renderDialog({ karma: 10, nuyen: -14535 })
    fireEvent.click(screen.getByRole("button", { name: /sell karma/i }))

    // Act
    fireEvent.click(screen.getByRole("button", { name: /^sell$/i }))

    // Assert
    await waitFor(() => expect(store.getState().runner.nuyen.current).toBe(-12035))
    expect(store.getState().runner.karma.current).toBe(9)
  })

  it("edits current and total karma directly and logs the adjustment", async () => {
    // Arrange
    const { store } = renderDialog({ karma: 10, total: 20 })
    fireEvent.click(screen.getByRole("button", { name: /edit karma/i }))

    // Act
    setCounter(/current/i, 4)
    setCounter(/total earned/i, 25)
    fireEvent.change(screen.getByRole("textbox", { name: /reason/i }), { target: { value: "Fixed typo" } })
    fireEvent.click(screen.getByRole("button", { name: /save/i }))

    // Assert
    await waitFor(() => expect(store.getState().runner.karma.current).toBe(4))
    const { karma } = store.getState().runner
    expect(karma.total).toBe(25)
    expect(karma.log.at(-1)).toMatchObject({ amount: -6, source: "adjustKarma" })
    expect(karma.log.at(-1)?.description).toMatch(/fixed typo/i)
  })

  it("disables Save on Edit Karma until a value changes", () => {
    // Arrange
    renderDialog()

    // Act
    fireEvent.click(screen.getByRole("button", { name: /edit karma/i }))

    // Assert
    expect((screen.getByRole("button", { name: /save/i }) as HTMLButtonElement).disabled).toBe(true)
  })
})
