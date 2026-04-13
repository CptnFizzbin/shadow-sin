import { ThemeProvider } from "@mui/material/styles"
import { cleanup, fireEvent, render, renderHook, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import { ImplantFormDialog } from "#/components/characterBuilder/sections/gear/cyberware/dialogs/implantFormDialog.tsx"
import { useImplantForm } from "#/components/characterBuilder/sections/gear/cyberware/forms/useImplantForm.tsx"
import { DeviceFormDialog } from "#/components/characterBuilder/sections/gear/devices/dialogs/deviceFormDialog.tsx"
import { ProgramFormDialog } from "#/components/characterBuilder/sections/gear/devices/dialogs/programFormDialog.tsx"
import { useDeviceForm } from "#/components/characterBuilder/sections/gear/devices/forms/useDeviceForm.tsx"
import { useProgramForm } from "#/components/characterBuilder/sections/gear/devices/forms/useProgramForm.tsx"
import { GearItemFormDialog } from "#/components/characterBuilder/sections/gear/generic/dialogs/gearItemFormDialog.tsx"
import { useItemForm } from "#/components/characterBuilder/sections/gear/generic/forms/useItemForm.tsx"
import { WeaponFormDialog } from "#/components/characterBuilder/sections/gear/weapons/dialogs/weaponFormDialog.tsx"
import { useWeaponForm } from "#/components/characterBuilder/sections/gear/weapons/forms/useWeaponForm.tsx"
import type { DeviceData } from "#/lib/system/gear/deviceData.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import type { ProgramData } from "#/lib/system/gear/programData.ts"
import type { WeaponData } from "#/lib/system/gear/weaponData.ts"
import type { ItemData } from "#/lib/system/itemData.ts"
import { ItemType } from "#/lib/system/itemType.ts"
import { theme } from "#/theme.ts"

// ---------------------------------------------------------------------------
// Test wrappers
// ---------------------------------------------------------------------------

const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const FullWrapper: FC<PropsWithChildren> = ({ children }) => {
  const store = new CharacterSheetStore(createDefaultCharacterSheet())
  return (
    <ThemeProvider theme={theme}>
      <CharacterSheetProvider store={store}>{children}</CharacterSheetProvider>
    </ThemeProvider>
  )
}

function renderWithTheme(element: ReactElement) {
  return render(element, { wrapper: ThemeWrapper })
}

function renderWithProviders(element: ReactElement) {
  return render(element, { wrapper: FullWrapper })
}

// Ensure MUI Dialog portals rendered into document.body are cleaned up between tests.
afterEach(() => cleanup())

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fillNameAndClickSave(nameValue: string) {
  // MUI Dialog uses portals; take the last rendered dialog to avoid stale ones.
  const dialogs = screen.getAllByRole("dialog")
  const dialog = dialogs[dialogs.length - 1]
  const nameInput = within(dialog).getByLabelText(/^name$/i)
  fireEvent.change(nameInput, { target: { value: nameValue } })
  const saveButton = within(dialog).getByRole("button", { name: /save/i })
  fireEvent.click(saveButton)
}

// ---------------------------------------------------------------------------
// useItemForm — default itemType
// ---------------------------------------------------------------------------

describe("useItemForm", () => {
  it("defaults to ItemType.other when no itemType is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({ onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.other)
  })

  it("uses ItemType.vehicle when itemType=vehicle is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({ itemType: ItemType.vehicle, onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.vehicle)
  })

  it("uses ItemType.armor when itemType=armor is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({ itemType: ItemType.armor, onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.armor)
  })

  it("preserves the existing item's itemType when editing", () => {
    const existingItem: ItemData = {
      id: crypto.randomUUID(),
      itemType: ItemType.vehicle,
      name: "Eurocar Westwind 2000",
      cost: 65000,
    }
    const { result } = renderHook(() =>
      useItemForm({ item: existingItem, onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.vehicle)
  })
})

// ---------------------------------------------------------------------------
// useWeaponForm — default itemType
// ---------------------------------------------------------------------------

describe("useWeaponForm", () => {
  it("always defaults to ItemType.weapon", () => {
    const { result } = renderHook(() =>
      useWeaponForm({ onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.weapon)
  })
})

// ---------------------------------------------------------------------------
// useImplantForm — default itemType
// ---------------------------------------------------------------------------

describe("useImplantForm", () => {
  it("always defaults to ItemType.implant", () => {
    const { result } = renderHook(() =>
      useImplantForm({ onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.implant)
  })
})

// ---------------------------------------------------------------------------
// useDeviceForm — default itemType
// ---------------------------------------------------------------------------

describe("useDeviceForm", () => {
  it("always defaults to ItemType.device", () => {
    const { result } = renderHook(() =>
      useDeviceForm({ onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.device)
  })
})

// ---------------------------------------------------------------------------
// useProgramForm — default itemType
// ---------------------------------------------------------------------------

describe("useProgramForm", () => {
  it("always defaults to ItemType.program", () => {
    const { result } = renderHook(() =>
      useProgramForm({ onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.program)
  })
})

// ---------------------------------------------------------------------------
// GearItemFormDialog — submits with the correct itemType
// ---------------------------------------------------------------------------

describe("GearItemFormDialog", () => {
  it("submits a vehicle item when itemType=vehicle", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog
        open
        itemType={ItemType.vehicle}
        label="Vehicle"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("Eurocar Westwind 2000")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.vehicle)
      expect(submitted.name).toBe("Eurocar Westwind 2000")
    })
  })

  it("submits an armor item when itemType=armor", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog
        open
        itemType={ItemType.armor}
        label="Armor"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("Armor Vest")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.armor)
    })
  })

  it("submits a misc (other) item when no itemType is provided", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog
        open
        label="Item"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("Random Gear")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.other)
    })
  })

  it("submits an explicit misc item when itemType=other", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <GearItemFormDialog
        open
        itemType={ItemType.other}
        label="Item"
        onSave={onSave}
        onClose={vi.fn()}
      />,
    )

    fillNameAndClickSave("Misc Item")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ItemData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.other)
    })
  })
})

// ---------------------------------------------------------------------------
// WeaponFormDialog — always submits ItemType.weapon
// ---------------------------------------------------------------------------

describe("WeaponFormDialog", () => {
  it("submits an item with ItemType.weapon", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <WeaponFormDialog open onSave={onSave} onClose={vi.fn()} />,
    )

    const dialogs = screen.getAllByRole("dialog")
    const dialog = dialogs[dialogs.length - 1]

    fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
      target: { value: "Ares Predator V" },
    })
    // Firearm weapon type requires a Damage value
    fireEvent.change(within(dialog).getByLabelText(/^damage$/i), {
      target: { value: "8P" },
    })

    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: WeaponData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.weapon)
    })
  })
})

// ---------------------------------------------------------------------------
// ImplantFormDialog — always submits ItemType.implant
// ---------------------------------------------------------------------------

describe("ImplantFormDialog", () => {
  it("submits an item with ItemType.implant", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <ImplantFormDialog open onSave={onSave} onClose={vi.fn()} />,
    )

    fillNameAndClickSave("Wired Reflexes 1")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ImplantData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.implant)
    })
  })
})

// ---------------------------------------------------------------------------
// DeviceFormDialog — always submits ItemType.device
// ---------------------------------------------------------------------------

describe("DeviceFormDialog", () => {
  it("submits an item with ItemType.device", async () => {
    const onSave = vi.fn()
    renderWithTheme(
      <DeviceFormDialog open onSave={onSave} onClose={vi.fn()} />,
    )

    fillNameAndClickSave("Renraku Sensei")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: DeviceData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.device)
    })
  })
})

// ---------------------------------------------------------------------------
// ProgramFormDialog — always submits ItemType.program (needs character context)
// ---------------------------------------------------------------------------

describe("ProgramFormDialog", () => {
  it("submits an item with ItemType.program", async () => {
    const onSave = vi.fn()
    renderWithProviders(
      <ProgramFormDialog open onSave={onSave} onClose={vi.fn()} />,
    )

    fillNameAndClickSave("Exploit")

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledOnce()
      const submitted: ProgramData = onSave.mock.calls[0][0]
      expect(submitted.itemType).toBe(ItemType.program)
    })
  })
})
