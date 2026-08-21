import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { SpriteList } from "./spriteList.tsx"

const courierSprite: SpriteData = {
  kind: EntityKind.sprite,
  id: NullUuid,
  name: "Courier",
  force: 4,
  services: { max: 3, used: 1 },
  bound: true,
  damage: { matrix: 0 },
}

function renderWithSprites(sprites: SpriteData[]) {
  const runnerData = runnerDataFactory((data) => {
    data.sprites = sprites
    return data
  })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<SpriteList />, { wrapper: Wrapper })

  return store
}

describe("SpriteList", () => {
  it("shows sprites from the store", () => {
    // Arrange / Act
    renderWithSprites([courierSprite])

    // Assert
    expect(screen.getByText("Courier")).toBeDefined()
  })

  it("dismissing a sprite, once confirmed, removes it from the store and the UI", async () => {
    // Arrange
    const store = renderWithSprites([courierSprite])

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))
    fireEvent.click(await screen.findByRole("button", { name: "Dismiss" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().sprites).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Courier")).toBeNull()
  })

  it("adjusting the Matrix damage track dispatches saveSprite and updates the store", async () => {
    // Arrange: box 3 is the first wound-marker cell (labeled "-1").
    const store = renderWithSprites([courierSprite])
    expect(store.getState().sprites[0].damage.matrix).toBe(0)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "-1" }))

    // Assert
    await waitFor(() => expect(store.getState().sprites[0].damage.matrix).toBe(3))
  })
})
