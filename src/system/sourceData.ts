import { z } from "zod"

/**
 * Represents the source (book and page) of an item or rule.
 */
export interface SourceData {
  book: string
  page: number
}

/**
 * Zod schema for validating SourceData.
 */
export const SourceDataSchema = z.object({
  book: z.string(),
  page: z.number().int().min(1),
}) satisfies z.ZodType<SourceData>

/**
 * List of available books and their display labels.
 */
export const bookOptions = [
  { value: "SR20A", label: "ShadowRun 20th" },
  { value: "AU", label: "Augmentation" },
  { value: "RC", label: "Runner's Companion" },
  { value: "AR", label: "Arsenal" },
  { value: "SM", label: "Street Magic" },
  { value: "UN", label: "Unwired" },
  { value: "ZOO", label: "Parazoology" },
  { value: "OLD", label: "This Old Drone" },
  { value: "MS", label: "Mil Spec Tech" },
  { value: "MS2", label: "Mil Spec Tech 2" },
  { value: "RBB", label: "Runner's Black Book 2074" },
  { value: "ATT", label: "Attitude" },
  { value: "WofA", label: "Way of the Adept" },
  { value: "WofS", label: "Way of the Samurai" },
  { value: "DW", label: "Deadly Waves" },
  { value: "UCL", label: "Used Car Lot" },
  { value: "US", label: "Unfriendly Skies" },
  { value: "GH", label: "Gun Heaven" },
  { value: "GH2", label: "Gun Heaven 2" },
] as const
