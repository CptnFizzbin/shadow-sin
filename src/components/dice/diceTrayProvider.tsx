import type { FC, PropsWithChildren } from "react"
import { createContext, useContext } from "react"

import { OutOfContextError } from "#/components/dialogs/api/outOfContextError.ts"

import type { DiceTrayApi } from "./diceTrayApi.ts"
import { DiceTrayDialog } from "./diceTrayDialog.tsx"

const DiceTrayContext = createContext<DiceTrayApi | null>(null)

interface DiceTrayProviderProps extends PropsWithChildren {
  diceTrayApi: DiceTrayApi
}

/**
 * Provides a {@link DiceTrayApi} instance to the subtree and renders the dice
 * tray dialog. Mount this inside {@link CharacterSheetProvider} so the dialog
 * can access edge and other character data.
 *
 * ```tsx
 * <CharacterSheetProvider store={store}>
 *   <DiceTrayProvider diceTrayApi={diceTrayApi}>
 *     <App />
 *   </DiceTrayProvider>
 * </CharacterSheetProvider>
 * ```
 */
export const DiceTrayProvider: FC<DiceTrayProviderProps> = ({ diceTrayApi, children }) => {
  return (
    <DiceTrayContext.Provider value={diceTrayApi}>
      {children}
      <DiceTrayDialog diceTrayApi={diceTrayApi} />
    </DiceTrayContext.Provider>
  )
}

/**
 * Returns the nearest {@link DiceTrayApi} instance from context.
 * Must be used within a {@link DiceTrayProvider}.
 *
 * ```ts
 * const diceTray = useDiceTray()
 * diceTray.roll(pool.size)
 * ```
 */
export const useDiceTray = (): DiceTrayApi => {
  const diceTrayApi = useContext(DiceTrayContext)

  if (!diceTrayApi) {
    throw new OutOfContextError("useDiceTray", "DiceTrayProvider")
  }

  return diceTrayApi
}
