import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { ComplexFormsList } from "./complexFormsList.tsx"

const diagnostics: ComplexFormData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Diagnostics",
  rating: 2,
}

function renderWithComplexForms(complexForms: ComplexFormData[]) {
  const runnerData = runnerDataFactory((data) => {
    data.biology.awakening = AwakeningType.Technomancer
    data.attributes[AttributeKey.resonance] = 6
    data.attributes[AttributeKey.logic] = 6
    data.complexForms = complexForms
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ComplexFormsList />, { wrapper: Wrapper })

  return store
}

describe("ComplexFormsList", () => {
  it("shows complex forms from the store", () => {
    // Arrange / Act
    renderWithComplexForms([diagnostics])

    // Assert
    expect(screen.getByText("Diagnostics")).toBeDefined()
    expect(screen.getByText("1 / 12 forms")).toBeDefined()
  })

  it("adding a complex form dispatches saveComplexForm and updates the store", async () => {
    // Arrange
    const store = renderWithComplexForms([])

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add complex form/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Complex Form" })
    fireEvent.change(within(dialog).getByLabelText(/program name/i), {
      target: { value: "Puppeteer" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().complexForms).toHaveLength(1))
    expect(store.getState().complexForms[0].name).toBe("Puppeteer")
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Puppeteer")).toBeDefined()
  })

  it("removing a complex form dispatches removeComplexForm and updates the store", async () => {
    // Arrange
    const store = renderWithComplexForms([diagnostics])

    // Act: the delete icon button has no accessible name.
    const deleteButton = screen.getAllByRole("button").find((button) => button.textContent === "")
    fireEvent.click(deleteButton!)

    // Assert: state updated...
    await waitFor(() => expect(store.getState().complexForms).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Diagnostics")).toBeNull()
  })
})
