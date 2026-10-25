import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiArrowUpCircleLine,
  RiEditLine,
  RiHandCoinLine,
  RiShoppingCartLine,
  RiTrophyLine,
} from "@remixicon/react"

export type ManageKarmaOptionKey = "earn" | "buy" | "spend" | "sell" | "edit"

export interface ManageKarmaOption {
  key: ManageKarmaOptionKey
  label: string
  description: string
  Icon: RemixiconComponentType
  /** Shown only while the `karma.nuyenExchange` House Rule is on. */
  requiresNuyenExchange?: boolean
}

/** The workflows offered on the Manage Karma dialog's landing step, in display order. */
export const MANAGE_KARMA_OPTIONS: ManageKarmaOption[] = [
  { key: "earn", label: "Earn Karma", description: "Karma awarded by the GM", Icon: RiTrophyLine },
  {
    key: "buy",
    label: "Buy Karma",
    description: "Trade nuyen for karma",
    Icon: RiShoppingCartLine,
    requiresNuyenExchange: true,
  },
  { key: "spend", label: "Spend Karma", description: "Spend karma on advancements", Icon: RiArrowUpCircleLine },
  {
    key: "sell",
    label: "Sell Karma",
    description: "Trade karma for nuyen",
    Icon: RiHandCoinLine,
    requiresNuyenExchange: true,
  },
  { key: "edit", label: "Edit Karma", description: "Make changes to karma outside of the rules", Icon: RiEditLine },
]
