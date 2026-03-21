import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type {
  ComplexFormFormState,
  SpriteFormState,
} from "#/components/Character/Form/Resources/Technomancer/TechnomancerFormState.ts"
import {
  calculateComplexFormsBp,
  calculateSpritesBp,
  getMaxComplexForms,
  getMaxSprites,
} from "#/components/Character/Form/Resources/Technomancer/TechnomancerRequirements.ts"
import { SkillKey } from "#/lib/system/types/SkillKey.ts"

export function useTechnomancerFormGroup() {
  const awakenedSlice = useCharacterBuilderStoreSlice(
    (state) => state.awakened,
    (state, awakened) => {
      state.awakened = awakened
      return state
    },
  )

  const resonanceValue = useCharacterBuilderStore(
    (state) => state.attributes.resonance.value,
  )
  const logicValue = useCharacterBuilderStore(
    (state) => state.attributes.logic.value,
  )
  const charismaValue = useCharacterBuilderStore(
    (state) => state.attributes.charisma.value,
  )
  const activeSkills = useCharacterBuilderStore(
    (state) => state.skills.activeSkills,
  )

  const compilingSkill = activeSkills.find(
    (skill) => skill.name === SkillKey.compiling,
  )
  const compilingRating = compilingSkill?.rating ?? 0

  const maxComplexForms = getMaxComplexForms(logicValue)
  const maxSprites = getMaxSprites(charismaValue)

  const complexForms = awakenedSlice.state.complexForms
  const sprites = awakenedSlice.state.sprites

  const totalComplexFormsBp = calculateComplexFormsBp(complexForms)
  const totalSpritesBp = calculateSpritesBp(sprites)
  const totalAwakenedBp = totalComplexFormsBp + totalSpritesBp

  const addComplexForm = (form: ComplexFormFormState) => {
    awakenedSlice.update((draft) => {
      draft.complexForms.push(form)
    })
  }

  const updateComplexForm = (form: ComplexFormFormState) => {
    awakenedSlice.update((draft) => {
      draft.complexForms = draft.complexForms.map((f) =>
        f.id === form.id ? form : f,
      )
    })
  }

  const removeComplexForm = (formId: string) => {
    awakenedSlice.update((draft) => {
      draft.complexForms = draft.complexForms.filter((f) => f.id !== formId)
    })
  }

  const addSprite = (sprite: SpriteFormState) => {
    awakenedSlice.update((draft) => {
      draft.sprites.push(sprite)
    })
  }

  const updateSprite = (sprite: SpriteFormState) => {
    awakenedSlice.update((draft) => {
      draft.sprites = draft.sprites.map((s) =>
        s.id === sprite.id ? sprite : s,
      )
    })
  }

  const removeSprite = (spriteId: string) => {
    awakenedSlice.update((draft) => {
      draft.sprites = draft.sprites.filter((s) => s.id !== spriteId)
    })
  }

  return {
    complexForms,
    sprites,
    resonanceValue,
    logicValue,
    charismaValue,
    compilingRating,
    maxComplexForms,
    maxSprites,
    totalComplexFormsBp,
    totalSpritesBp,
    totalAwakenedBp,
    addComplexForm,
    updateComplexForm,
    removeComplexForm,
    addSprite,
    updateSprite,
    removeSprite,
  }
}
