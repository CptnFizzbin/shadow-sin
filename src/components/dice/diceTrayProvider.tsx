import type { FC, PropsWithChildren } from "react"

import type { DiceTrayApi } from "./diceTrayApi.ts"
import { DiceTrayContext } from "./diceTrayContext.ts"
import { DiceTrayDialog } from "./diceTrayDialog.tsx"

interface DiceTrayProviderProps extends PropsWithChildren {
  diceTrayApi: DiceTrayApi
}

/**
 * Provides a {@link DiceTrayApi} instance to the subtree and renders the dice
 * tray dialog. Mount this inside {@link RunnerDataProvider} so the dialog
 * can access edge and other runner data.
 *
 * ```tsx
 * <RunnerDataProvider store={store}>
 *   <DiceTrayProvider diceTrayApi={diceTrayApi}>
 *     <App />
 *   </DiceTrayProvider>
 * </RunnerDataProvider>
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
