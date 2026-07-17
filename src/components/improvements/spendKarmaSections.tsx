import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiAwardLine,
  RiChat4Line,
  RiFlashlightLine,
  RiHeartPulseLine,
  RiLightbulbLine,
  RiSeedlingLine,
  RiSparklingLine,
  RiStackLine,
  RiTerminalBoxLine,
  RiWaterFlashLine,
} from "@remixicon/react"
import type { FC } from "react"

import { isMagician } from "#/components/runner/magician/magicianUtils.ts"
import { isTechnomancer } from "#/components/runner/technomancer/technomancerUtils.ts"
import type { AwakeningType } from "#/system/awakeningType.ts"
import { isMagical } from "#/system/awakeningType.ts"

import { ImprovementAttributeList } from "./attributes/improvementAttributeList.tsx"
import { ImprovementComplexFormList } from "./complexForm/improvementComplexFormList.tsx"
import { ImprovementInitiationList } from "./initiation/improvementInitiationList.tsx"
import { ImprovementQualityList } from "./qualities/improvementQualityList.tsx"
import { ImprovementActiveSkillList } from "./skills/improvementActiveSkillList.tsx"
import { ImprovementKnowledgeSkillList } from "./skills/improvementKnowledgeSkillList.tsx"
import { ImprovementLanguageSkillList } from "./skills/improvementLanguageSkillList.tsx"
import { ImprovementSkillGroupList } from "./skills/improvementSkillGroupList.tsx"
import { ImprovementSpellList } from "./spells/improvementSpellList.tsx"
import { ImprovementSubmersionList } from "./submersion/improvementSubmersionList.tsx"

export type SpendKarmaSectionKey =
  | "attribute"
  | "skill"
  | "skillGroup"
  | "knowledge"
  | "language"
  | "quality"
  | "spell"
  | "complexForm"
  | "initiation"
  | "submersion"

export interface SpendKarmaSection {
  key: SpendKarmaSectionKey
  label: string
  Icon: RemixiconComponentType
  /** Omit to show for every runner regardless of Awakening. */
  visibleFor?: (awakening: AwakeningType) => boolean
}

/** Category registry for the Spend Karma dialog's hub list. */
export const SPEND_KARMA_SECTIONS: SpendKarmaSection[] = [
  { key: "attribute", label: "Attributes", Icon: RiHeartPulseLine },
  { key: "skill", label: "Skills", Icon: RiFlashlightLine },
  { key: "skillGroup", label: "Skill Groups", Icon: RiStackLine },
  { key: "knowledge", label: "Knowledge", Icon: RiLightbulbLine },
  { key: "language", label: "Languages", Icon: RiChat4Line },
  { key: "quality", label: "Qualities", Icon: RiAwardLine },
  { key: "spell", label: "Spells", Icon: RiSparklingLine, visibleFor: isMagician },
  { key: "complexForm", label: "Complex Forms", Icon: RiTerminalBoxLine, visibleFor: isTechnomancer },
  { key: "initiation", label: "Initiation", Icon: RiSeedlingLine, visibleFor: isMagical },
  { key: "submersion", label: "Submersion", Icon: RiWaterFlashLine, visibleFor: isTechnomancer },
]

interface SpendKarmaSectionContentProps {
  section: SpendKarmaSectionKey
}

/** Renders the improvement list for one Spend Karma dialog section. */
export const SpendKarmaSectionContent: FC<SpendKarmaSectionContentProps> = ({ section }) => {
  switch (section) {
    case "attribute":
      return <ImprovementAttributeList />
    case "skill":
      return <ImprovementActiveSkillList />
    case "skillGroup":
      return <ImprovementSkillGroupList />
    case "knowledge":
      return <ImprovementKnowledgeSkillList />
    case "language":
      return <ImprovementLanguageSkillList />
    case "quality":
      return <ImprovementQualityList />
    case "spell":
      return <ImprovementSpellList />
    case "complexForm":
      return <ImprovementComplexFormList />
    case "initiation":
      return <ImprovementInitiationList />
    case "submersion":
      return <ImprovementSubmersionList />
  }
}
