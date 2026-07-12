import { createAction } from "@reduxjs/toolkit"

import type { RunnerData } from "#/system/runnerData.ts"

/**
 * Whole-object replace, kept for the rare caller (e.g. metatype/awakening changes) that needs to
 * touch `biology` alongside `attributes`/`qualities` atomically, which a single-key reducer can't
 * express on its own — those call sites write via `sheet.setState(...)` directly instead.
 */
export const setBiology = createAction<RunnerData["biology"]>("biology/set")
