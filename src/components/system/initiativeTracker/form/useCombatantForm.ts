import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import type { Combatant, SkillEntry, WeaponEntry } from "#/lib/stores/initiativeTracker/initiativeTrackerData.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeOrder } from "#/system/attributeKey.ts"

export type CombatantInput = Omit<Combatant, "id" | "passesCompleted">

interface CombatantFormValues {
  isPC: boolean
  name: string
  score: number | undefined
  totalPasses: number | undefined
  initiativeDice: number | undefined
  attributes: Partial<Record<AttributeKey, number>>
  armor: string
  resistBod: number | undefined
  resistWil: number | undefined
  skills: SkillEntry[]
  weapons: WeaponEntry[]
}

const defaultValues: CombatantFormValues = {
  isPC: false,
  name: "",
  score: undefined,
  totalPasses: 1,
  initiativeDice: undefined,
  attributes: Object.fromEntries(AttributeOrder.map((key) => [key, undefined])),
  armor: "",
  resistBod: undefined,
  resistWil: undefined,
  skills: [],
  weapons: [],
}

interface UseCombatantFormOptions {
  onSubmit: (combatant: CombatantInput) => void
}

/**
 * A single form backs both unit types, toggled via `isPC` — NPCs get the
 * full stat-block fields, PCs get just enough to track their turn, since
 * their full sheet already lives on their own runner data.
 */
export const useCombatantForm = ({ onSubmit }: UseCombatantFormOptions) => useAppForm({
  defaultValues,
  onSubmit: ({ value }) => {
    if (value.isPC) {
      onSubmit({
        name: value.name,
        isPC: true,
        score: value.score ?? 0,
        totalPasses: value.totalPasses ?? 1,
      })
      return
    }

    const attributes = Object.fromEntries(
      Object.entries(value.attributes).filter(([, rating]) => rating !== undefined),
    )

    onSubmit({
      name: value.name,
      isPC: false,
      score: value.score ?? 0,
      totalPasses: value.totalPasses ?? 1,
      initiativeDice: value.initiativeDice,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
      armor: value.armor || undefined,
      resistBod: value.resistBod,
      resistWil: value.resistWil,
      skills: value.skills.length > 0 ? value.skills : undefined,
      weapons: value.weapons.length > 0 ? value.weapons : undefined,
    })
  },
})

export type CombatantForm = ReturnType<typeof useCombatantForm>
