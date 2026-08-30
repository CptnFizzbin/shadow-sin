import { z } from "zod"

/**
 * A language a Runner speaks — one of the three Skill flavours from CONTEXT.md's **Skill**
 * glossary entry. `isNative: true` is a starting native language — free, never improved with
 * Karma — while `isNative: false` carries a learned `rating`. `lingo` is an optional regional
 * dialect/accent specialization.
 */
export type LanguageSkillData =
  | { name: string, isNative: true, lingo?: string }
  | { name: string, isNative: false, rating: number, lingo?: string }

/**
 * Private, file-local base carrying `LanguageSkillData`'s shared fields — extended by each
 * `LanguageSkillDataSchema` union branch below so they aren't duplicated twice in this file.
 * Scoped to this file only; not a codebase-wide schema-composition pattern (see AGENTS.md).
 */
const languageSkillDataBaseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lingo: z.string().optional(),
})

export const LanguageSkillDataSchema = z.discriminatedUnion("isNative", [
  languageSkillDataBaseSchema.extend({ isNative: z.literal(true) }).strict(),
  languageSkillDataBaseSchema.extend({ isNative: z.literal(false), rating: z.number().int().min(1) }).strict(),
]) satisfies z.ZodType<LanguageSkillData>
