import { ThemeProvider } from "@mui/material/styles"
import { Store } from "@tanstack/store"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import type { BuilderRootState } from "#/components/builder/builderRootState.ts"
import { CharacterBuilderStoreProvider } from "#/components/builder/characterBuilderStoreProvider.tsx"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { DialogApi } from "#/components/dialogs/api/dialogApi.ts"
import { DialogApiProvider } from "#/components/dialogs/api/dialogApiProvider.tsx"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
import { theme } from "#/theme.ts"

import { ImplantItemList } from "./implantItemList.tsx"

function makeImplant(overrides: Partial<ImplantData> & Pick<ImplantData, "id" | "name">): ImplantData {
  return {
    itemType: ItemType.implant,
    implantType: ImplantType.cyberware,
    essenceCost: 1,
    cost: 0,
    effects: [],
    ...overrides,
  }
}

interface WrapperProps extends PropsWithChildren {
  gear: Record<string, ImplantData>
}

const BuilderWrapperWithGear: FC<WrapperProps> = ({ gear, children }) => {
  const [rootStore] = useState(
    () =>
      new Store<BuilderRootState>({
        character: {
          ...createDefaultCharacterSheet(),
          gear,
        },
        builder: { startingNuyen: undefined },
      }),
  )
  return (
    <ThemeProvider theme={theme}>
      <CharacterBuilderStoreProvider rootStore={rootStore}>
        {children}
      </CharacterBuilderStoreProvider>
    </ThemeProvider>
  )
}

describe("ImplantItemList", () => {
  it("opens the edit dialog pre-filled with the accessory's data, not the parent's", async () => {
    // Arrange
    const parentId = "aaaaaaaa-0000-0000-0000-000000000001" as ReturnType<typeof crypto.randomUUID>
    const accessoryId = "aaaaaaaa-0000-0000-0000-000000000002" as ReturnType<typeof crypto.randomUUID>

    const parentImplant = makeImplant({
      id: parentId,
      name: "Wired Reflexes 1",
      childIds: [accessoryId],
    })
    const accessory = makeImplant({
      id: accessoryId,
      name: "Alphaware Upgrade",
      parentId,
    })

    render(<ImplantItemList />, {
      wrapper: ({ children }) => {
        const dialogApi = new DialogApi()

        return (
          <DialogApiProvider dialogApi={dialogApi}>
            <BuilderWrapperWithGear gear={{ [parentId]: parentImplant, [accessoryId]: accessory }}>
              {children}
            </BuilderWrapperWithGear>
          </DialogApiProvider>
        )
      },
    })

    // Act — click the accessory card to open the edit dialog
    fireEvent.click(screen.getByText("Alphaware Upgrade"))

    // Assert — the dialog should open with the accessory's name, not the parent's
    await waitFor(() => {
      const dialogs = screen.getAllByRole("dialog")
      const dialog = dialogs[dialogs.length - 1]
      const nameField = within(dialog).getByLabelText(/^name$/i)
      expect((nameField as HTMLInputElement).value).toBe("Alphaware Upgrade")
    })
  })
})
