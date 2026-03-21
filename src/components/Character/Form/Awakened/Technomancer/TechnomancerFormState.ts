export interface ComplexFormFormState {
  id: string
  name: string
  rating: number
}

export interface SpriteFormState {
  id: string
  name: string
  tasks: number
}

export interface AwakenedFormState {
  complexForms: ComplexFormFormState[]
  sprites: SpriteFormState[]
}
