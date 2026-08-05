import { CardLayoutBodyRow } from "./layout/cardLayoutBodyRow.tsx"
import { CardLayoutFooterRow } from "./layout/cardLayoutFooterRow.tsx"
import { CardLayoutHeaderRow } from "./layout/cardLayoutHeaderRow.tsx"

/**
 * EntityCard's structural regions, kept under `.Layout` so they read distinctly from the content
 * elements below (`EntityCard.Layout.HeaderRow` vs. `EntityCard.Title`) — every category tier
 * (`ItemCard`, `SpiritCard`, ...) assembles these regions plus its own incremental elements.
 */
export const EntityCardLayout = {
  HeaderRow: CardLayoutHeaderRow,
  BodyRow: CardLayoutBodyRow,
  FooterRow: CardLayoutFooterRow,
}
