import { ThemeProvider } from "@mui/material/styles"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { useMemo } from "react"
import { describe, expect, it } from "vitest"

import { builderStateFactory } from "#/components/builder/builderState.ts"
import { BuilderStoreProvider } from "#/components/builder/builderStoreProvider.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { builderStoreReducer } from "#/stores/builder/builderStore.reducer.ts"
import type { ImplantData } from "#/system/gear/implantData.ts"
import { ImplantType } from "#/system/gear/implantData.ts"
import { ItemType } from "#/system/itemType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
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
  const runnerStore = useMemo(() => {
    return new RunnerDataStore({
      ...runnerDataFactory(),
      gear,
    })
  }, [gear])

  const builderStore = useMemo(() => {
    return createCompatStore(builderStateFactory(), builderStoreReducer)
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <BuilderStoreProvider runnerStore={runnerStore} builderStore={builderStore}>
        {children}
      </BuilderStoreProvider>
    </ThemeProvider>
  )
}

describe("ImplantItemList", () => {
  it("opens the edit dialog pre-filled with the accessory's data, not the parent's", async () => {
    // Arrange
    const parentId = "aaaaaaaa-0000-0000-0000-000000000001"
    const accessoryId = "aaaaaaaa-0000-0000-0000-000000000002"

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

    render(
      <BuilderWrapperWithGear gear={{ [parentId]: parentImplant, [accessoryId]: accessory }}>
        <ImplantItemList />
      </BuilderWrapperWithGear>,
    )

    // Act: the accessory's Edit button is the second one rendered (after the parent's).
    const editButtons = screen.getAllByRole("button", { name: "Edit" })
    fireEvent.click(editButtons[1])

    // Assert
    const dialog = await screen.findByRole("dialog")
    const nameField = within(dialog).getByLabelText(/^name$/i)
    expect((nameField as HTMLInputElement).value).toBe("Alphaware Upgrade")
  })

  it("removing an implant, once confirmed, dispatches removeItem and updates the store", async () => {
    // Arrange
    const implantId = "aaaaaaaa-0000-0000-0000-000000000003"
    const implant = makeImplant({ id: implantId, name: "Wired Reflexes 1" })

    render(
      <BuilderWrapperWithGear gear={{ [implantId]: implant }}>
        <ImplantItemList />
      </BuilderWrapperWithGear>,
    )
    expect(screen.getByText("Wired Reflexes 1")).toBeDefined()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Remove" }))
    fireEvent.click(await screen.findByRole("button", { name: "Remove Implant" }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByText("Wired Reflexes 1")).toBeNull())
  })
})
