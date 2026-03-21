import type {
  ComplexFormFormState,
  SpriteFormState,
} from "#/components/Character/Form/Resources/Technomancer/TechnomancerFormState.ts"

/** Each rating point of a complex form costs 1 BP. */
export const ComplexFormBpPerRating = 1

/** Each task for a sprite costs 1 BP. */
export const SpriteBpPerTask = 1

export const getComplexFormBp = (rating: number): number =>
  rating * ComplexFormBpPerRating

export const getSpriteTasksBp = (tasks: number): number =>
  tasks * SpriteBpPerTask

export const getMaxComplexForms = (logic: number): number => logic * 2

export const getMaxSprites = (charisma: number): number => charisma

export const calculateComplexFormsBp = (
  complexForms: ComplexFormFormState[],
): number =>
  complexForms.reduce((total, form) => total + getComplexFormBp(form.rating), 0)

export const calculateSpritesBp = (sprites: SpriteFormState[]): number =>
  sprites.reduce((total, sprite) => total + getSpriteTasksBp(sprite.tasks), 0)
