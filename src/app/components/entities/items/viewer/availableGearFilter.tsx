import type { FC, PropsWithChildren } from "react"

import { isItemOnHand } from "#rules/items/itemStateRules.ts"

import type { GearListFilter } from "./gearListFilter.ts"
import { GearListFilterContext } from "./gearListFilter.ts"

const availableGear: GearListFilter = { includes: isItemOnHand }

/** Narrows every gear list inside it to On Hand Items, leaving Stashed ones to the Gear page. */
export const AvailableGearFilter: FC<PropsWithChildren> = ({ children }) => (
  <GearListFilterContext.Provider value={availableGear}>{children}</GearListFilterContext.Provider>
)
