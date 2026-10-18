import { z } from "zod"

export enum FavourDirection {
  contactOwes = "contactOwes",
  runnerOwes = "runnerOwes",
}

export interface FavourData {
  description: string
  direction: FavourDirection
}

export const FavourDataSchema = z.object({
  description: z.string(),
  direction: z.enum(FavourDirection),
}) satisfies z.ZodType<FavourData>
