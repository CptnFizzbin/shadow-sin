import { yamlToRunnerData } from "#/components/system/exportImport/exportUtils.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import MouseYaml from "./mouse.2026-11-17.sin?raw"

/** Mouse's stable id, from the export. */
export const MOUSE_RUNNER_ID = "01a1df51-914a-7069-998a-81618d6aae7c" as const
/** Mouse's Force 4 Spellcasting Focus for Combat spells, bonded and equipped. */
export const MOUSE_SPELLCASTING_FOCUS_ID = "11ecdda2-1d95-45ae-ac39-a57aa595011e" as const

/**
 * Mouse: a Pixie mage (Magic 6, Spellcasting 6 specialized in Combat Spells) carrying a bonded,
 * equipped Force 4 Spellcasting Focus for Combat spells, among other gear. Loaded from a real
 * `.sin` export and run through the migrations, so each call returns a fresh, current
 * {@link RunnerData}.
 */
export function loadMouse(): RunnerData {
  return yamlToRunnerData(MouseYaml)
}
