// PROTOTYPE — shared section registry for the spend-karma dialog prototypes.
// See spendKarmaDialogPrototypes.tsx for the plan; delete alongside it.
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

import { ImprovementActiveSkillList } from "#/components/runner/karma/runnerImprovements/improvementActiveSkillList.tsx"
import { ImprovementAttributeList } from "#/components/runner/karma/runnerImprovements/improvementAttributeList.tsx"
import { ImprovementKnowledgeSkillList } from "#/components/runner/karma/runnerImprovements/improvementKnowledgeSkillList.tsx"
import { ImprovementLanguageSkillList } from "#/components/runner/karma/runnerImprovements/improvementLanguageSkillList.tsx"
import { ImprovementSkillGroupList } from "#/components/runner/karma/runnerImprovements/improvementSkillGroupList.tsx"
import { ImprovementSpellList } from "#/components/runner/karma/runnerImprovements/improvementSpellList.tsx"

export type SpendKarmaSectionKey = "attribute" | "skill" | "skillGroup" | "knowledge" | "language" | "spell"

export interface SpendKarmaSection {
  key: SpendKarmaSectionKey
  label: string
  /** Compact label for space-constrained navigation (e.g. a bottom bar). */
  shortLabel: string
  Icon: RemixiconComponentType
  spellcasterOnly?: boolean
}

export const SPEND_KARMA_SECTIONS: SpendKarmaSection[] = [
  { key: "attribute", label: "Attributes", shortLabel: "Attrs", Icon: RiHeartPulseLine },
  { key: "skill", label: "Skills", shortLabel: "Skills", Icon: RiFlashlightLine },
  { key: "skillGroup", label: "Skill Groups", shortLabel: "Groups", Icon: RiStackLine },
  { key: "knowledge", label: "Knowledge", shortLabel: "Know", Icon: RiLightbulbLine },
  { key: "language", label: "Languages", shortLabel: "Lang", Icon: RiChat4Line },
  { key: "spell", label: "Spells", shortLabel: "Spells", Icon: RiSparklingLine, spellcasterOnly: true },
]

interface SpendKarmaSectionContentProps {
  section: SpendKarmaSectionKey
  /** Passed to sections that can navigate away (skill groups' back link). */
  onBack?: () => void
}

export const SpendKarmaSectionContent: FC<SpendKarmaSectionContentProps> = ({ section, onBack }) => {
  switch (section) {
    case "attribute":
      return <ImprovementAttributeList />
    case "skill":
      return <ImprovementActiveSkillList />
    case "skillGroup":
      return <ImprovementSkillGroupList onBack={onBack ?? (() => undefined)} />
    case "knowledge":
      return <ImprovementKnowledgeSkillList />
    case "language":
      return <ImprovementLanguageSkillList />
    case "spell":
      return <ImprovementSpellList />
  }
}
