import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiArrowUpCircleLine,
  RiEditLine,
  RiHandCoinLine,
  RiShoppingCartLine,
  RiTrophyLine,
} from "@remixicon/react"

import type { GameTableFeatures } from "#/services/gameTable/gameTableService.ts"

import { ManageKarmaStep, ManageKarmaStepLabels } from "./manageKarmaWorkflow.ts"

export interface ManageKarmaOption {
  step: ManageKarmaStep
  label: string
  description: string
  Icon: RemixiconComponentType
  /** Shown only while the `karma.nuyenExchange` House Rule is on. */
  requiresNuyenExchange?: boolean
  /** Shown only while this Table feature is on. */
  requiresTableFeature?: keyof GameTableFeatures
}

const option = (
  step: ManageKarmaStep,
  description: string,
  Icon: RemixiconComponentType,
  requiresNuyenExchange?: boolean,
  requiresTableFeature?: keyof GameTableFeatures,
): ManageKarmaOption => ({
  step,
  label: ManageKarmaStepLabels[step],
  description,
  Icon,
  requiresNuyenExchange,
  requiresTableFeature,
})

/** The workflows offered on the Manage Karma dialog's menu, in display order. */
export const MANAGE_KARMA_OPTIONS: ManageKarmaOption[] = [
  option(ManageKarmaStep.Earn, "Karma awarded by the GM", RiTrophyLine),
  option(ManageKarmaStep.Buy, "Trade nuyen for karma", RiShoppingCartLine, true),
  option(ManageKarmaStep.Spend, "Spend karma on advancements", RiArrowUpCircleLine),
  option(ManageKarmaStep.Sell, "Trade karma for nuyen", RiHandCoinLine, true, "karmaSelling"),
  option(ManageKarmaStep.Edit, "Make changes to karma outside of the rules", RiEditLine),
]
