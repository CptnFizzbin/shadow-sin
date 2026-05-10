/**
 * Find the next available alias by appending an incrementing number.
 * E.g. "Artemis" → "Artemis 2" → "Artemis 3" … until no existing character
 * uses that alias.
 */
export function resolveAlias(
  baseAlias: string,
  existingAliases: Set<string>,
): string {
  let counter = 2
  let candidate = `${baseAlias} ${counter}`
  while (existingAliases.has(candidate)) {
    counter++
    candidate = `${baseAlias} ${counter}`
  }
  return candidate
}
