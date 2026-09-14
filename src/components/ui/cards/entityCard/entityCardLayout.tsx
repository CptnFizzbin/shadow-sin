import { BodyRow } from "./layout/bodyRow.tsx"
import { FooterLeft } from "./layout/footerLeft.tsx"
import { FooterRight } from "./layout/footerRight.tsx"
import { FooterRow } from "./layout/footerRow.tsx"
import { HeaderRight } from "./layout/headerRight.tsx"
import { HeaderRow } from "./layout/headerRow.tsx"
import { TitleRight } from "./layout/titleRight.tsx"

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
