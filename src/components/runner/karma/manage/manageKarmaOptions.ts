import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiArrowUpCircleLine,
  RiEditLine,
  RiHandCoinLine,
  RiShoppingCartLine,
  RiTrophyLine,
} from "@remixicon/react"

import type { KarmaExchangeDirection } from "#/state/runner/karma/karma.selector.ts"

import { ManageKarmaStep, ManageKarmaStepLabels } from "./manageKarmaWorkflow.ts"

export interface ManageKarmaOption {
  step: ManageKarmaStep
  label: string
  description: string
  Icon: RemixiconComponentType
  /** The karma exchange this workflow trades in; shown only while that exchange is enabled. */
  exchange?: KarmaExchangeDirection
}

const option = (
  step: ManageKarmaStep,
  description: string,
  Icon: RemixiconComponentType,
  exchange?: KarmaExchangeDirection,
): ManageKarmaOption => ({
  step,
  label: ManageKarmaStepLabels[step],
  description,
  Icon,
  exchange,
})

/** The workflows offered on the Manage Karma dialog's menu, in display order. */
export const MANAGE_KARMA_OPTIONS: ManageKarmaOption[] = [
  option(ManageKarmaStep.Earn, "Karma awarded by the GM", RiTrophyLine),
  option(ManageKarmaStep.Buy, "Trade nuyen for karma", RiShoppingCartLine, "buy"),
  option(ManageKarmaStep.Spend, "Spend karma on advancements", RiArrowUpCircleLine),
  option(ManageKarmaStep.Sell, "Trade karma for nuyen", RiHandCoinLine, "sell"),
  option(ManageKarmaStep.Edit, "Make changes to karma outside of the rules", RiEditLine),
]
