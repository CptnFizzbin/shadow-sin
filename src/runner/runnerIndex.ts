import { z } from "zod"

import type { RunnerId } from "./runnerId.ts"

export interface RunnerRef {
  id: RunnerId
  name: string
  lastModified: string // ISO 8601 timestamp
}

export const SavedRunnerSchema = z.object({
  id: z.string().transform((val) => val as RunnerId),
  name: z.string(),
  lastModified: z.string(),
}) satisfies z.ZodType<RunnerRef>

export const RunnerIndexSchema = z.array(SavedRunnerSchema)
