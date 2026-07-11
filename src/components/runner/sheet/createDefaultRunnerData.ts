import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `runnerDataFactory` from `#/system/runnerData.factory.ts` instead. */
export const createDefaultRunnerData = (): RunnerData => runnerDataFactory()
