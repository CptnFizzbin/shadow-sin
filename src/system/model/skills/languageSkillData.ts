import { z } from "zod"

import type { UUID } from "#/utils/uuidUtils.ts"

/**
 * A language a Runner speaks — one of the three Skill flavours from CONTEXT.md's **Skill**
 * glossary entry. `isNative: true` is a starting native language — free, never improved with
 * Karma — while `isNative: false` carries a learned `rating`. Consumers branch on `isNative`;
 * `rating` is only meaningful (and only ever set) when `isNative` is `false`. `lingo` is an
 * optional regional dialect/accent specialization.
 */
export interface LanguageSkillData {
  /** Stays the same when the language is renamed. */
  id: UUID
  name: string
  isNative: boolean
  rating?: number
  lingo?: string
}

/**
 * Zod schema for validating LanguageSkillData.
 */
export const LanguageSkillDataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1, "Name is required"),
  isNative: z.boolean(),
  rating: z.number().int().min(1).optional(),
  lingo: z.string().optional(),
}) satisfies z.ZodType<LanguageSkillData>
