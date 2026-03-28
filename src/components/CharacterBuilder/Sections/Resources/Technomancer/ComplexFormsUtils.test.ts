import { describe, expect, it } from "vitest"

import type { ComplexFormFormState } from "#/components/CharacterBuilder/Sections/Resources/AwakenedFormState.ts"
import { getComplexFormBp } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexFormsUtils.ts"
import {
  ComplexFormBpPerRating,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/TechnomancerUtils.ts"

function makeComplexForm(rating: number): ComplexFormFormState {
  return { id: "test-form", name: "Test Complex Form", rating }
}

describe("getComplexFormBp", () => {
  it("returns 0 BP for a complex form with rating 0", () => {
    expect(getComplexFormBp(makeComplexForm(0))).toBe(0)
  })

  it("returns ComplexFormBpPerRating for a complex form with rating 1", () => {
    expect(getComplexFormBp(makeComplexForm(1))).toBe(ComplexFormBpPerRating)
  })

  it("returns rating × ComplexFormBpPerRating for a complex form with rating 5", () => {
    expect(getComplexFormBp(makeComplexForm(5))).toBe(5 * ComplexFormBpPerRating)
  })

  it("returns rating × ComplexFormBpPerRating for a higher rating", () => {
    expect(getComplexFormBp(makeComplexForm(12))).toBe(12 * ComplexFormBpPerRating)
  })
})
