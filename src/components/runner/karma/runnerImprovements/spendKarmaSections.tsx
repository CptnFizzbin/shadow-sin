import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiChat4Line,
  RiFlashlightLine,
  RiHeartPulseLine,
  RiLightbulbLine,
  RiSparklingLine,
  RiStackLine,
} from "@remixicon/react"
import type { FC } from "react"

import { ImprovementActiveSkillList } from "./improvementActiveSkillList.tsx"
import { ImprovementAttributeList } from "./improvementAttributeList.tsx"
import { ImprovementKnowledgeSkillList } from "./improvementKnowledgeSkillList.tsx"
import { ImprovementLanguageSkillList } from "./improvementLanguageSkillList.tsx"
import { ImprovementSkillGroupList } from "./improvementSkillGroupList.tsx"
import { ImprovementSpellList } from "./improvementSpellList.tsx"

export type SpendKarmaSectionKey = "attribute" | "skill" | "skillGroup" | "knowledge" | "language" | "spell"

export interface SpendKarmaSection {
  key: SpendKarmaSectionKey
  label: string
  Icon: RemixiconComponentType
  spellcasterOnly?: boolean
}

/** Category registry for the Spend Karma dialog's hub list. */
export const SPEND_KARMA_SECTIONS: SpendKarmaSection[] = [
  { key: "attribute", label: "Attributes", Icon: RiHeartPulseLine },
  { key: "skill", label: "Skills", Icon: RiFlashlightLine },
  { key: "skillGroup", label: "Skill Groups", Icon: RiStackLine },
  { key: "knowledge", label: "Knowledge", Icon: RiLightbulbLine },
  { key: "language", label: "Languages", Icon: RiChat4Line },
  { key: "spell", label: "Spells", Icon: RiSparklingLine, spellcasterOnly: true },
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
    case "spell":
      return <ImprovementSpellList />
  }
}
