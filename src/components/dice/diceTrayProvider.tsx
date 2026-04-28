import type { FC, PropsWithChildren } from "react"

import type { DiceTrayApi } from "./diceTrayApi.ts"
import { DiceTrayContext, useDiceTray } from "./diceTrayContext.ts"
import { DiceTrayDialog } from "./diceTrayDialog.tsx"

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
      <DiceTrayDialog />
    </DiceTrayContext.Provider>
  )
}

export { useDiceTray }
