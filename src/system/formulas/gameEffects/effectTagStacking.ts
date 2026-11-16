interface EffectTagStackingOptions<T> {
  getTags: (entry: T) => readonly string[] | undefined
  getValue: (entry: T) => number
  /** Entries only compete with others in the same group (e.g. the same target); all compete by default. */
  getGroupKey?: (entry: T) => string
}

/**
 * Applies the effect tag stacking rule: entries that share a tag don't stack. Going from the highest
 * value down (earlier entries first on a tie), an entry applies unless one of its tags is already
 * held by an entry that applies; an entry with no tags always applies. Keeps the order of `entries`.
 *
 * @example
 * // A Power Focus (+2) and a Spellcasting Focus (+3), both tagged "focus", on one pool: only the +3 applies.
 * keepHighestPerTag(groups, { getTags: (group) => group.tags, getValue: (group) => group.size })
 */
export function keepHighestPerTag<T>(entries: readonly T[], options: EffectTagStackingOptions<T>): T[] {
  const { getTags, getValue, getGroupKey = () => "" } = options
  const keysOf = (entry: T): string[] => (getTags(entry) ?? [])
    .filter((tag) => tag !== "")
    .map((tag) => JSON.stringify([getGroupKey(entry), tag]))

  const heldKeys = new Set<string>()
  const applying = new Set<T>()
  const highestFirst = entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => getValue(b.entry) - getValue(a.entry) || a.index - b.index)

  for (const { entry } of highestFirst) {
    const keys = keysOf(entry)
    if (keys.some((key) => heldKeys.has(key))) continue
    keys.forEach((key) => heldKeys.add(key))
    applying.add(entry)
  }

  return entries.filter((entry) => applying.has(entry))
}
