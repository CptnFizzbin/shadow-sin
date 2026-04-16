import { Store } from "@tanstack/store"
import { ThemeProvider } from "@mui/material/styles"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { useMemo } from "react"
import { afterEach } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import type { BuilderRootState } from "#/components/characterBuilder/builderRootState.ts"
import { CharacterBuilderStoreProvider } from "#/components/characterBuilder/characterBuilderStoreProvider.tsx"
import { theme } from "#/theme.ts"

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export const FullWrapper: FC<PropsWithChildren> = ({ children }) => {
  const store = useMemo(() => new CharacterSheetStore(createDefaultCharacterSheet()), [])
  return (
    <ThemeProvider theme={theme}>
      <CharacterSheetProvider store={store}>{children}</CharacterSheetProvider>
    </ThemeProvider>
  )
}

export const BuilderWrapper: FC<PropsWithChildren> = ({ children }) => {
  const rootStore = useMemo(
    () =>
      new Store<BuilderRootState>({
        character: createDefaultCharacterSheet(),
        builder: { startingNuyen: undefined },
      }),
    [],
  )
  return (
    <ThemeProvider theme={theme}>
      <CharacterBuilderStoreProvider rootStore={rootStore}>
        {children}
      </CharacterBuilderStoreProvider>
    </ThemeProvider>
  )
}

export function renderWithTheme(element: ReactElement) {
  return render(element, { wrapper: ThemeWrapper })
}

export function renderWithProviders(element: ReactElement) {
  return render(element, { wrapper: FullWrapper })
}

export function renderInBuilder(element: ReactElement) {
  return render(element, { wrapper: BuilderWrapper })
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
