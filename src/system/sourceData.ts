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

const bookGroups = {
  core: "Core Books",
  suplimental: "Suplimental Books",
  legacy: "Legacy Books",
}

const books = {
  SR4A: { label: "Shadowrun 20th Anniversary", group: bookGroups.core },
  AU: { label: "Augmentation", group: bookGroups.core },
  RC: { label: "Runner's Companion", group: bookGroups.core },
  AR: { label: "Arsenal", group: bookGroups.core },
  SM: { label: "Street Magic", group: bookGroups.core },
  UN: { label: "Unwired", group: bookGroups.core },

  ZOO: { label: "Parazoology", group: bookGroups.suplimental },
  OLD: { label: "This Old Drone", group: bookGroups.suplimental },
  MS: { label: "Mil Spec Tech", group: bookGroups.suplimental },
  MS2: { label: "Mil Spec Tech 2", group: bookGroups.suplimental },
  RBB: { label: "Runner's Black Book 2074", group: bookGroups.suplimental },
  ATT: { label: "Attitude", group: bookGroups.suplimental },
  WofA: { label: "Way of the Adept", group: bookGroups.suplimental },
  WofS: { label: "Way of the Samurai", group: bookGroups.suplimental },
  DW: { label: "Deadly Waves", group: bookGroups.suplimental },
  UCL: { label: "Used Car Lot", group: bookGroups.suplimental },
  US: { label: "Unfriendly Skies", group: bookGroups.suplimental },
  GH: { label: "Gun Heaven", group: bookGroups.suplimental },
  GH2: { label: "Gun Heaven 2", group: bookGroups.suplimental },

  SR4: { label: "Shadowrun 4th", group: bookGroups.legacy },
} as const

export type BookKey = keyof typeof books

/**
 * List of available books and their display labels.
 */
export const bookOptions = Object.entries(books)
  .map(([key, value]) => ({ value: key as BookKey, ...value }))

export const formatBookRef = (source: SourceData) => {
  return `${source.book} p.${source.page}`
}
