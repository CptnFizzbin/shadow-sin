import { z } from "zod"

/**
 * An Entity whose Rating admits a "real"/unrated case instead of a plain number — a Real SIN or
 * Licence. `rating` is only meaningful (and only ever set) when `isReal` is `false`; that
 * relationship isn't type-enforced, so consumers branch on `isReal` explicitly. Implemented by
 * `SinData`/`LicenseData`.
 */
export interface Credential {
  isReal: boolean
  rating?: number
}

export const CredentialSchema = z.object({
  isReal: z.boolean(),
  rating: z.number().int().min(1).optional(),
}) satisfies z.ZodType<Credential>

export const isCredential = (obj: object): obj is Credential => {
  return CredentialSchema.safeParse(obj).success
}
