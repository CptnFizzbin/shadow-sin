import type { FC, PropsWithChildren } from "react"

import type { GearListFilter } from "./gearListFilter.ts"
import { GearListFilterContext } from "./gearListFilter.ts"

const availableGear: GearListFilter = { includes: (item) => !item.stashed }

/** Narrows every gear list inside it to Available Items, leaving Stashed ones to the Gear page. */
export const AvailableGearFilter: FC<PropsWithChildren> = ({ children }) => (
  <GearListFilterContext.Provider value={availableGear}>{children}</GearListFilterContext.Provider>
)
