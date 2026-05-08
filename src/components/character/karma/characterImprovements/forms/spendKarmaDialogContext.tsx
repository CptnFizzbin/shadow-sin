import { useSelector } from "@tanstack/react-store"
import type { FC, PropsWithChildren, SyntheticEvent } from "react"
import { createContext, useContext, useMemo, useState } from "react"

import { getSkillsInGroup } from "#/components/builder/sections/skills/activeSkills/skillGroupUtils.ts"
import { useAllAttrInfos } from "#/components/character/characterUtils.ts"
import { ImprovementsStore } from "#/components/character/karma/characterImprovements/improvementsStore.ts"
import { applyImprovements } from "#/components/character/karma/characterImprovements/improvementsUtils.ts"
import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { isMagician } from "#/components/character/spells/spellsUtils.ts"
import type { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"
import { AttributeKey, AttributeOrder } from "#/system/attributeKey.ts"
import type { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import type { SkillKey } from "#/system/skills/skillKey.ts"
import { skillList } from "#/system/skills/skillList.ts"
import { SkillGroupRatingMax, SkillRatingMax } from "#/system/skills/skillUtils.ts"

export type SpendType = "attribute" | "skillGroup" | "increaseSkill" | "newSkill" | "newSpell"

export const SPEND_TYPE_LABELS: Record<SpendType, string> = {
  attribute: "Attribute",
  skillGroup: "Skill Group",
  increaseSkill: "Increase Skill",
  newSkill: "New Skill",
  newSpell: "New Spell",
}

export interface IncreaseSkillEntry {
  key: SkillKey
  currentRating: number
  groupToBreak?: SkillGroupKey
}

const NEW_SPELL_KARMA_COST = 5
const NEW_SKILL_KARMA_COST = 2

const attributeKarmaCost = (newRating: number) => 5 * newRating
const skillGroupKarmaCost = (newRating: number) => 2 * newRating
const increaseSkillKarmaCost = (newRating: number) => 2 * newRating

interface SpendKarmaDialogContextValue {
  currentKarma: number
  spendType: SpendType
  canLearnSpell: boolean
  karmaCost: number | null
  canSave: boolean

  selectedAttribute: AttributeKey | ""
  availableAttributes: AttributeKey[]
  attributes: Record<AttributeKey, number>
  attrInfos: Record<AttributeKey, { min: number, max: number, augMax?: number }>
  setSelectedAttribute: (key: AttributeKey) => void

  selectedSkillGroupKey: SkillGroupKey | ""
  availableSkillGroups: { name: SkillGroupKey, rating: number }[]
  setSelectedSkillGroupKey: (key: SkillGroupKey) => void

  selectedIncreaseSkillKey: SkillKey | ""
  selectedIncreaseSkillEntry: IncreaseSkillEntry | undefined
  availableIncreaseSkills: IncreaseSkillEntry[]
  setSelectedIncreaseSkillKey: (key: SkillKey) => void

  selectedNewSkillKey: SkillKey | ""
  availableNewSkills: SkillKey[]
  setSelectedNewSkillKey: (key: SkillKey) => void

  handleSpendTypeChange: (event: SyntheticEvent, newValue: SpendType) => void
  handleSave: () => void
  handleClosed: () => void
}

const SpendKarmaDialogContext = createContext<SpendKarmaDialogContextValue | null>(null)

interface SpendKarmaDialogProviderProps extends PropsWithChildren {
  ctrl: DialogCtrl<void>
  onNewSpell?: () => void
}

export const SpendKarmaDialogProvider: FC<SpendKarmaDialogProviderProps> = ({
  ctrl,
  onNewSpell,
  children,
}) => {
  const characterSheetStore = useCharacterSheetContext()
  const karmaStore = useKarmaStore()

  const currentKarma = useSelector(karmaStore, selectCurrentKarma)
  const awakeningType = useCharacterSheetSelector((sheet) => sheet.biology.awakening)
  const attributes = useCharacterSheetSelector((sheet) => sheet.attributes)
  const activeSkills = useCharacterSheetSelector((sheet) => sheet.skills.activeSkills)
  const skillGroups = useCharacterSheetSelector((sheet) => sheet.skills.skillGroups)
  const attrInfos = useAllAttrInfos()

  const canLearnSpell = isMagician(awakeningType) && !!onNewSpell

  const [spendType, setSpendType] = useState<SpendType>("attribute")
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeKey | "">("")
  const [selectedSkillGroupKey, setSelectedSkillGroupKey] = useState<SkillGroupKey | "">("")
  const [selectedIncreaseSkillKey, setSelectedIncreaseSkillKey] = useState<SkillKey | "">("")
  const [selectedNewSkillKey, setSelectedNewSkillKey] = useState<SkillKey | "">("")

  const availableAttributes = useMemo(() => {
    return AttributeOrder.filter((key) => {
      if (key === AttributeKey.essence) return false
      const info = attrInfos[key]
      const currentValue = attributes[key]
      return info.max > 0 && currentValue < info.max
    })
  }, [attrInfos, attributes])

  const availableSkillGroups = useMemo(() => {
    return skillGroups.filter((group) => group.rating < SkillGroupRatingMax)
  }, [skillGroups])

  const availableIncreaseSkills = useMemo(() => {
    const fromActiveSkills = activeSkills
      .filter((skill) => skill.rating < SkillRatingMax)
      .map((skill) => ({
        key: skill.name,
        currentRating: skill.rating,
        groupToBreak: undefined as SkillGroupKey | undefined,
      }))

    const fromSkillGroups = skillGroups.flatMap((group) => {
      return getSkillsInGroup(group.name)
        .filter((skillKey) => !activeSkills.find((skill) => skill.name === skillKey))
        .map((skillKey) => ({
          key: skillKey,
          currentRating: group.rating,
          groupToBreak: group.name as SkillGroupKey,
        }))
    })

    return [...fromActiveSkills, ...fromSkillGroups]
  }, [activeSkills, skillGroups])

  const availableNewSkills = useMemo(() => {
    const existing = new Set(activeSkills.map((skill) => skill.name))
    const coveredByGroup = new Set(skillGroups.flatMap((group) => getSkillsInGroup(group.name)))
    return (Object.keys(skillList) as SkillKey[]).filter(
      (key) => !existing.has(key) && !coveredByGroup.has(key),
    )
  }, [activeSkills, skillGroups])

  const selectedIncreaseSkillEntry = useMemo(
    () => availableIncreaseSkills.find((skill) => skill.key === selectedIncreaseSkillKey),
    [availableIncreaseSkills, selectedIncreaseSkillKey],
  )

  const karmaCost = useMemo((): number | null => {
    switch (spendType) {
      case "attribute": {
        if (!selectedAttribute) return null
        const currentValue = attributes[selectedAttribute]
        return attributeKarmaCost(currentValue + 1)
      }
      case "skillGroup": {
        if (!selectedSkillGroupKey) return null
        const group = skillGroups.find((grp) => grp.name === selectedSkillGroupKey)
        const currentRating = group?.rating ?? 0
        return skillGroupKarmaCost(currentRating + 1)
      }
      case "increaseSkill": {
        if (!selectedIncreaseSkillEntry) return null
        return increaseSkillKarmaCost(selectedIncreaseSkillEntry.currentRating + 1)
      }
      case "newSkill":
        return selectedNewSkillKey ? NEW_SKILL_KARMA_COST : null
      case "newSpell":
        return NEW_SPELL_KARMA_COST
      default:
        return null
    }
  }, [
    spendType,
    selectedAttribute,
    selectedSkillGroupKey,
    selectedIncreaseSkillEntry,
    selectedNewSkillKey,
    attributes,
    skillGroups,
  ])

  const canSave = karmaCost !== null && karmaCost <= currentKarma

  const handleSpendTypeChange = (_event: SyntheticEvent, newValue: SpendType) => {
    setSpendType(newValue)
    setSelectedAttribute("")
    setSelectedSkillGroupKey("")
    setSelectedIncreaseSkillKey("")
    setSelectedNewSkillKey("")
  }

  const handleSave = () => {
    if (!canSave || karmaCost === null) return

    if (spendType === "newSpell") {
      karmaStore.spendKarma(karmaCost)
      ctrl.close()
      onNewSpell?.()
      return
    }

    const improvementsStore = new ImprovementsStore({ improvements: [] })

    switch (spendType) {
      case "attribute": {
        if (!selectedAttribute) return
        improvementsStore.improveAttribute(selectedAttribute, attributes[selectedAttribute] + 1)
        break
      }
      case "skillGroup": {
        if (!selectedSkillGroupKey) return
        const group = skillGroups.find((grp) => grp.name === selectedSkillGroupKey)
        improvementsStore.improveSkillGroup(selectedSkillGroupKey, (group?.rating ?? 0) + 1)
        break
      }
      case "increaseSkill": {
        if (!selectedIncreaseSkillEntry) return
        const { key: skillKey, currentRating } = selectedIncreaseSkillEntry
        improvementsStore.improveActiveSkill(skillKey, currentRating + 1)
        break
      }
      case "newSkill": {
        if (!selectedNewSkillKey) return
        improvementsStore.improveActiveSkill(selectedNewSkillKey, 1)
        break
      }
      default:
        break
    }

    applyImprovements(improvementsStore, characterSheetStore)
    karmaStore.spendKarma(karmaCost)
    ctrl.close()
  }

  const handleClosed = () => {
    setSpendType("attribute")
    setSelectedAttribute("")
    setSelectedSkillGroupKey("")
    setSelectedIncreaseSkillKey("")
    setSelectedNewSkillKey("")
  }

  const contextValue: SpendKarmaDialogContextValue = {
    currentKarma,
    spendType,
    canLearnSpell,
    karmaCost,
    canSave,
    selectedAttribute,
    availableAttributes,
    attributes,
    attrInfos,
    setSelectedAttribute,
    selectedSkillGroupKey,
    availableSkillGroups,
    setSelectedSkillGroupKey,
    selectedIncreaseSkillKey,
    selectedIncreaseSkillEntry,
    availableIncreaseSkills,
    setSelectedIncreaseSkillKey,
    selectedNewSkillKey,
    availableNewSkills,
    setSelectedNewSkillKey,
    handleSpendTypeChange,
    handleSave,
    handleClosed,
  }

  return (
    <SpendKarmaDialogContext.Provider value={contextValue}>
      {children}
    </SpendKarmaDialogContext.Provider>
  )
}

export const useSpendKarmaDialogContext = (): SpendKarmaDialogContextValue => {
  const ctx = useContext(SpendKarmaDialogContext)
  if (!ctx) throw new OutOfContextError("useSpendKarmaDialogContext", "SpendKarmaDialogProvider")
  return ctx
}
