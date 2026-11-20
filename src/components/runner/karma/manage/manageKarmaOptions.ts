import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiArrowUpCircleLine,
  RiEditLine,
  RiHandCoinLine,
  RiShoppingCartLine,
  RiTrophyLine,
} from "@remixicon/react"

import type { FlagEntry } from "#/system/model/featureFlags/featureFlag.ts"
import { houseRules } from "#/system/model/featureFlags/houseRules.ts"

import { ManageKarmaStep, ManageKarmaStepLabels } from "./manageKarmaWorkflow.ts"

export interface ManageKarmaOption {
  step: ManageKarmaStep
  label: string
  description: string
  Icon: RemixiconComponentType
  /** Shown only while every one of these boolean feature flags is on. */
  requiredFlags: FlagEntry<boolean>[]
}

const option = (
  step: ManageKarmaStep,
  description: string,
  Icon: RemixiconComponentType,
  requiredFlags: FlagEntry<boolean>[] = [],
): ManageKarmaOption => ({
  step,
  label: ManageKarmaStepLabels[step],
  description,
  Icon,
  requiredFlags,
})

/** The workflows offered on the Manage Karma dialog's menu, in display order. */
export const MANAGE_KARMA_OPTIONS: ManageKarmaOption[] = [
  option(ManageKarmaStep.Earn, "Karma awarded by the GM", RiTrophyLine),
  option(ManageKarmaStep.Buy, "Trade nuyen for karma", RiShoppingCartLine, [houseRules["karma.nuyenExchange"]]),
  option(ManageKarmaStep.Spend, "Spend karma on advancements", RiArrowUpCircleLine),
  option(ManageKarmaStep.Sell, "Trade karma for nuyen", RiHandCoinLine, [
    houseRules["karma.nuyenExchange"],
    houseRules["karma.selling"],
  ]),
  option(ManageKarmaStep.Edit, "Make changes to karma outside of the rules", RiEditLine),
]
