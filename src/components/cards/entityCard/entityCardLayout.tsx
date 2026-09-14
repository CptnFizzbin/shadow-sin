import { BodyRow } from "#/components/cards/entityCard/layout/bodyRow.tsx"
import { FooterLeft } from "#/components/cards/entityCard/layout/footerLeft.tsx"
import { FooterRight } from "#/components/cards/entityCard/layout/footerRight.tsx"
import { FooterRow } from "#/components/cards/entityCard/layout/footerRow.tsx"
import { HeaderRight } from "#/components/cards/entityCard/layout/headerRight.tsx"
import { HeaderRow } from "#/components/cards/entityCard/layout/headerRow.tsx"
import { TitleRight } from "#/components/cards/entityCard/layout/titleRight.tsx"

/**
 * EntityCard's structural regions, kept under `.Layout` so they read distinctly from the content
 * elements below (`EntityCard.Layout.HeaderRow` vs. `EntityCard.Title`) — every category tier
 * (`ItemCard`, `SpiritCard`, ...) assembles these regions plus its own incremental elements.
 */
const EntityCardLayout = {
  HeaderRow: HeaderRow,
  BodyRow: BodyRow,
  FooterRow: FooterRow,
  FooterLeft: FooterLeft,
  FooterRight: FooterRight,
  TitleRight: TitleRight,
  TopRight: HeaderRight,
}
export default EntityCardLayout
