import { BodyRow } from "./layout/bodyRow.tsx"
import { FooterRow } from "./layout/footerRow.tsx"
import { HeaderRow } from "./layout/headerRow.tsx"

/**
 * EntityCard's structural regions, kept under `.Layout` so they read distinctly from the content
 * elements below (`EntityCard.Layout.HeaderRow` vs. `EntityCard.Title`) — every category tier
 * (`ItemCard`, `SpiritCard`, ...) assembles these regions plus its own incremental elements.
 */
export const EntityCardLayout = {
  HeaderRow,
  BodyRow,
  FooterRow,
}
