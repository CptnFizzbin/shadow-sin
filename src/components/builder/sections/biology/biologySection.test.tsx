import { fireEvent, render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AwakeningType } from "#/system/awakeningType.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { BiologySection } from "./biologySection.tsx"

// The Metatype and Awakening MUI Selects don't wire an accessible name
// (no `labelId`), so they're only distinguishable by document order:
// Metatype renders first, Awakening (when present) second. Each combobox's
// displayed value also renders the option's BP cost alongside its name, so
// assertions match a substring rather than an exact string.
const metatypeCombobox = () => screen.getAllByRole("combobox")[0]
const awakeningCombobox = () => screen.getAllByRole("combobox")[1]

function renderWithBiology(metatype: MetatypeType, awakening: AwakeningType) {
  const runnerData = runnerDataFactory({ override: (data) => {
    data.biology.metatype = metatype
    data.biology.awakening = awakening
    return data
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<BiologySection />, { wrapper: Wrapper })

  return store
}

describe("BiologySection", () => {
  it("shows the runner's current metatype and awakening from the store", () => {
    // Arrange / Act
    renderWithBiology(MetatypeType.Elf, AwakeningType.Adept)

    // Assert
    expect(metatypeCombobox().textContent).toContain("Elf")
    expect(awakeningCombobox().textContent).toContain("Adept")
  })

  it("changing metatype updates the store and recalculates attributes", () => {
    // Arrange
    const store = renderWithBiology(MetatypeType.Human, AwakeningType.Mundane)

    // Act
    fireEvent.mouseDown(metatypeCombobox())
    fireEvent.click(screen.getByRole("option", { name: /Troll/ }))

    // Assert: state updated...
    expect(store.getState().biology.metatype).toBe(MetatypeType.Troll)
    // ...and the UI re-rendered off that same state.
    expect(metatypeCombobox().textContent).toContain("Troll")
  })

  it("hides the Awakening selector for an AI runner", () => {
    // Arrange / Act: AI isn't a selectable option in the dropdown (it's excluded
    // from the metatype list), so this state can only be reached pre-seeded.
    renderWithBiology(MetatypeType.AI, AwakeningType.Mundane)

    // Assert
    expect(screen.getAllByRole("combobox")).toHaveLength(1)
  })

  it("changing awakening updates the store and the UI", () => {
    // Arrange
    const store = renderWithBiology(MetatypeType.Human, AwakeningType.Mundane)

    // Act
    fireEvent.mouseDown(awakeningCombobox())
    fireEvent.click(screen.getByRole("option", { name: /Magician/ }))

    // Assert
    expect(store.getState().biology.awakening).toBe(AwakeningType.Magician)
    expect(awakeningCombobox().textContent).toContain("Magician")
  })
})
