import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { SpritesList } from "./spritesList.tsx"

const courier: SpriteData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Courier",
  force: 3,
  services: { max: 2, used: 0 },
}

function renderWithSprites(sprites: SpriteData[]) {
  const runnerData = runnerDataFactory((data) => {
    data.biology.awakening = AwakeningType.Technomancer
    data.attributes[AttributeKey.charisma] = 6
    data.sprites = sprites
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<SpritesList />, { wrapper: Wrapper })

  return store
}

describe("SpritesList", () => {
  it("shows sprites from the store", () => {
    // Arrange / Act
    renderWithSprites([courier])

    // Assert
    expect(screen.getByText("Courier")).toBeDefined()
    expect(screen.getByText("1 / 6 sprites")).toBeDefined()
  })

  it("adding a sprite dispatches saveSprite and updates the store", async () => {
    // Arrange
    const store = renderWithSprites([])

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add sprite/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Sprite" })
    fireEvent.change(within(dialog).getByLabelText(/sprite name/i), {
      target: { value: "Fault" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().sprites).toHaveLength(1))
    expect(store.getState().sprites[0].name).toBe("Fault")
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Fault")).toBeDefined()
  })

  it("removing a sprite dispatches removeSprite and updates the store", async () => {
    // Arrange
    const store = renderWithSprites([courier])

    // Act: the delete icon button has no accessible name.
    const deleteButton = screen.getAllByRole("button").find((button) => button.textContent === "")
    fireEvent.click(deleteButton!)

    // Assert: state updated...
    await waitFor(() => expect(store.getState().sprites).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Courier")).toBeNull()
  })
})
