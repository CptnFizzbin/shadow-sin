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
  RiStarLine,
  RiTerminalBoxLine,
  RiWaterFlashLine,
} from "@remixicon/react"
import type { FC } from "react"

import { isMagician } from "#/components/magician/viewer/magicianUtils.ts"
import { isTechnomancer } from "#/components/technomancer/viewer/technomancerUtils.ts"
import type { AwakeningType } from "#/system/model/magic/awakeningType.ts"
import { isMagical } from "#/system/model/magic/awakeningType.ts"

import { ImprovementAttributeList } from "#/components/karma/improvements/attributes/improvementAttributeList.tsx"
import { ImprovementComplexFormList } from "#/components/karma/improvements/complexForm/improvementComplexFormList.tsx"
import { ImprovementInitiationList } from "#/components/karma/improvements/initiation/improvementInitiationList.tsx"
import { ImprovementQualityList } from "#/components/karma/improvements/qualities/improvementQualityList.tsx"
import { ImprovementActiveSkillList } from "#/components/karma/improvements/skills/improvementActiveSkillList.tsx"
import { ImprovementKnowledgeSkillList } from "#/components/karma/improvements/skills/improvementKnowledgeSkillList.tsx"
import { ImprovementLanguageSkillList } from "#/components/karma/improvements/skills/improvementLanguageSkillList.tsx"
import { ImprovementSkillGroupList } from "#/components/karma/improvements/skills/improvementSkillGroupList.tsx"
import { ImprovementSpecializationList } from "#/components/karma/improvements/skills/improvementSpecializationList.tsx"
import { ImprovementSpellList } from "#/components/karma/improvements/spells/improvementSpellList.tsx"
import { ImprovementSubmersionList } from "#/components/karma/improvements/submersion/improvementSubmersionList.tsx"

export type SpendKarmaSectionKey =
  | "attribute"
  | "skill"
  | "skillGroup"
  | "knowledge"
  | "language"
  | "specialization"
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
  { key: "specialization", label: "Specialization", Icon: RiStarLine },
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
    case "specialization":
      return <ImprovementSpecializationList />
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
