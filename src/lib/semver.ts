/**
 * Parses a semantic version string into its numeric components.
 * Expects the format "major.minor.patch" (e.g. "1.0.0").
 */
function parseSemver(version: string): [number, number, number] {
  const parts = version.split(".").map(Number)
  return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0]
}

/**
 * Compares two semantic version strings.
 * Returns -1 if a < b, 0 if a === b, 1 if a > b.
 */
export function compareSemver(versionA: string, versionB: string): -1 | 0 | 1 {
  const [majorA, minorA, patchA] = parseSemver(versionA)
  const [majorB, minorB, patchB] = parseSemver(versionB)

  if (majorA !== majorB) return majorA < majorB ? -1 : 1
  if (minorA !== minorB) return minorA < minorB ? -1 : 1
  if (patchA !== patchB) return patchA < patchB ? -1 : 1
  return 0
}

/** The current schema version for PlayerCharacterData. */
export const CURRENT_CHARACTER_VERSION = "1.0.0"

/** The current schema version for CharacterFormState (builder draft). */
export const CURRENT_FORM_STATE_VERSION = "1.0.0"
