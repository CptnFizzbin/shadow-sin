import { useSelector } from "@tanstack/react-store"
import type { FC, PropsWithChildren, SyntheticEvent } from "react"
import { createContext, useContext, useState } from "react"

import { ImprovementsStore } from "#/components/character/karma/characterImprovements/improvementsStore.ts"
import { applyImprovementsAndSpendKarma } from "#/components/character/karma/characterImprovements/improvementsUtils.ts"
import { selectCurrentKarma } from "#/components/character/karma/karmaSelectors.ts"
import { useKarmaStore } from "#/components/character/karma/useKarmaStore.ts"
import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { isMagician } from "#/components/character/spells/spellsUtils.ts"
import type { DialogCtrl } from "#/components/dialogs/api/dialogCtrl.ts"
import { OutOfContextError } from "#/lib/errors/outOfContextError.ts"

export type SpendType = "attribute" | "skillGroup" | "increaseSkill" | "newSkill" | "newSpell"

export const SPEND_TYPE_LABELS: Record<SpendType, string> = {
  attribute: "Attribute",
  skillGroup: "Skill Group",
  increaseSkill: "Increase Skill",
  newSkill: "New Skill",
  newSpell: "New Spell",
}

const NEW_SPELL_KARMA_COST = 5

interface PendingImprovement {
  improvementsStore: ImprovementsStore
  karmaCost: number
}

interface SpendKarmaDialogContextValue {
  currentKarma: number
  spendType: SpendType
  canLearnSpell: boolean
  karmaCost: number | null
  canSave: boolean
  setPendingImprovement: (improvement: PendingImprovement | null) => void
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
  const canLearnSpell = isMagician(awakeningType) && !!onNewSpell

  const [spendType, setSpendType] = useState<SpendType>("attribute")
  const [pendingImprovement, setPendingImprovement] = useState<PendingImprovement | null>(null)

  const karmaCost = spendType === "newSpell"
    ? NEW_SPELL_KARMA_COST
    : pendingImprovement?.karmaCost ?? null
  const canSave = karmaCost !== null && karmaCost <= currentKarma

  const handleSpendTypeChange = (_event: SyntheticEvent, newValue: SpendType) => {
    setSpendType(newValue)
    setPendingImprovement(null)
  }

  const handleSave = () => {
    if (!canSave || karmaCost === null) return

    if (spendType === "newSpell") {
      // Keep all karma spending paths on the same canonical helper API.
      applyImprovementsAndSpendKarma(
        new ImprovementsStore({ improvements: [] }),
        characterSheetStore,
        karmaStore,
        NEW_SPELL_KARMA_COST,
      )
      ctrl.close()
      onNewSpell?.()
      return
    }

    if (!pendingImprovement) return

    applyImprovementsAndSpendKarma(
      pendingImprovement.improvementsStore,
      characterSheetStore,
      karmaStore,
      pendingImprovement.karmaCost,
    )
    ctrl.close()
  }

  const handleClosed = () => {
    setSpendType("attribute")
    setPendingImprovement(null)
  }

  const contextValue: SpendKarmaDialogContextValue = {
    currentKarma,
    spendType,
    canLearnSpell,
    karmaCost,
    canSave,
    setPendingImprovement,
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
  const contextValue = useContext(SpendKarmaDialogContext)
  if (!contextValue) throw new OutOfContextError("useSpendKarmaDialogContext", "SpendKarmaDialogProvider")
  return contextValue
}
