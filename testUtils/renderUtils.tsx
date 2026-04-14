import { ThemeProvider } from "@mui/material/styles"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { useRef } from "react"
import { afterEach } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import { theme } from "#/theme.ts"

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export const FullWrapper: FC<PropsWithChildren> = ({ children }) => {
  const storeRef = useRef<CharacterSheetStore>(null)
  if (storeRef.current === null) {
    storeRef.current = new CharacterSheetStore(createDefaultCharacterSheet())
  }
  return (
    <ThemeProvider theme={theme}>
      <CharacterSheetProvider store={storeRef.current}>{children}</CharacterSheetProvider>
    </ThemeProvider>
  )
}

export function renderWithTheme(element: ReactElement) {
  return render(element, { wrapper: ThemeWrapper })
}

export function renderWithProviders(element: ReactElement) {
  return render(element, { wrapper: FullWrapper })
}

/**
 * Fills the "Name" field in the last rendered MUI Dialog and clicks "Save".
 * MUI Dialog uses portals; using the last dialog avoids stale portal nodes
 * left over from previous tests.
 */
export function fillNameAndClickSave(nameValue: string) {
  const dialogs = screen.getAllByRole("dialog")
  const dialog = dialogs[dialogs.length - 1]
  fireEvent.change(within(dialog).getByLabelText(/^name$/i), {
    target: { value: nameValue },
  })
  fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))
}

// Ensure MUI Dialog portals rendered into document.body are cleaned up between tests.
afterEach(() => cleanup())
