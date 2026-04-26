import { ThemeProvider } from "@mui/material/styles"
import { Store } from "@tanstack/store"
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { useMemo } from "react"
import { afterEach } from "vitest"

import type { BuilderRootState } from "#/components/builder/builderRootState.ts"
import { CharacterBuilderStoreProvider } from "#/components/builder/characterBuilderStoreProvider.tsx"
import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { DialogApi } from "#/components/dialogs/api/dialogApi.ts"
import { DialogApiProvider } from "#/components/dialogs/api/dialogApiProvider.tsx"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { theme } from "#/theme.ts"

export const ThemeWrapper: FC<PropsWithChildren> = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

const FullWrapper: FC<PropsWithChildren> = ({ children }) => {
  const store = useMemo(() => new CharacterSheetStore(createDefaultCharacterSheet()), [])
  const dialogApi = useMemo(() => new DialogApi(), [])
  return (
    <ThemeProvider theme={theme}>
      <DialogApiProvider dialogApi={dialogApi}>
        <CharacterSheetProvider store={store}>{children}</CharacterSheetProvider>
      </DialogApiProvider>
    </ThemeProvider>
  )
}

const BuilderWrapper: FC<PropsWithChildren> = ({ children }) => {
  const rootStore = useMemo(
    () =>
      new Store<BuilderRootState>({
        character: createDefaultCharacterSheet(),
        builder: { startingNuyen: undefined },
      }),
    [],
  )
  const dialogApi = useMemo(() => new DialogApi(), [])
  return (
    <ThemeProvider theme={theme}>
      <DialogApiProvider dialogApi={dialogApi}>
        <CharacterBuilderStoreProvider rootStore={rootStore}>
          {children}
        </CharacterBuilderStoreProvider>
      </DialogApiProvider>
    </ThemeProvider>
  )
}

export interface RenderWithProvidersOptions {
  /** Mutate the default `CharacterSheet` before the store is created. */
  updateCharacterSheet?: (characterSheet: CharacterSheet) => void
}

export interface RenderInBuilderOptions {
  /** Mutate the default `BuilderRootState` before the root store is created. */
  updateRootState?: (rootState: BuilderRootState) => void
}

export function renderWithProviders(
  element: ReactElement,
  options?: RenderWithProvidersOptions,
) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const store = useMemo(() => {
      const characterSheet = createDefaultCharacterSheet()
      options?.updateCharacterSheet?.(characterSheet)
      return new CharacterSheetStore(characterSheet)
    }, [])
    const dialogApi = useMemo(() => new DialogApi(), [])
    return (
      <ThemeProvider theme={theme}>
        <DialogApiProvider dialogApi={dialogApi}>
          <CharacterSheetProvider store={store}>{children}</CharacterSheetProvider>
        </DialogApiProvider>
      </ThemeProvider>
    )
  }

  return options ? render(element, { wrapper: Wrapper }) : render(element, { wrapper: FullWrapper })
}

export function renderInBuilder(
  element: ReactElement,
  options?: RenderInBuilderOptions,
) {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => {
    const rootStore = useMemo(() => {
      const rootState: BuilderRootState = {
        character: createDefaultCharacterSheet(),
        builder: { startingNuyen: undefined },
      }
      options?.updateRootState?.(rootState)
      return new Store<BuilderRootState>(rootState)
    }, [])
    const dialogApi = useMemo(() => new DialogApi(), [])
    return (
      <ThemeProvider theme={theme}>
        <DialogApiProvider dialogApi={dialogApi}>
          <CharacterBuilderStoreProvider rootStore={rootStore}>
            {children}
          </CharacterBuilderStoreProvider>
        </DialogApiProvider>
      </ThemeProvider>
    )
  }

  return options ? render(element, { wrapper: Wrapper }) : render(element, { wrapper: BuilderWrapper })
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
