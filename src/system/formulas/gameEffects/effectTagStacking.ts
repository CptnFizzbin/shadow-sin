interface EffectTagStackingOptions<T> {
  getTags: (entry: T) => readonly string[] | undefined
  getValue: (entry: T) => number
  /** Entries only compete with others in the same group (e.g. the same target); all compete by default. */
  getGroupKey?: (entry: T) => string
}

/**
 * The entries the effect tag stacking rule overrides. Entries that share a tag don't stack: going
 * from the highest value down (earlier entries first on a tie), an entry applies unless one of its
 * tags is already held by an entry that applies. An entry with no tags always applies.
 */
export function findOverriddenByTag<T>(entries: readonly T[], options: EffectTagStackingOptions<T>): Set<T> {
  const { getTags, getValue, getGroupKey = () => "" } = options
  const keysOf = (entry: T): string[] => (getTags(entry) ?? [])
    .filter((tag) => tag !== "")
    .map((tag) => JSON.stringify([getGroupKey(entry), tag]))

  const heldKeys = new Set<string>()
  const overridden = new Set<T>()
  const highestFirst = entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => getValue(b.entry) - getValue(a.entry) || a.index - b.index)

  for (const { entry } of highestFirst) {
    const keys = keysOf(entry)
    if (keys.some((key) => heldKeys.has(key))) {
      overridden.add(entry)
      continue
    }
    keys.forEach((key) => heldKeys.add(key))
  }

  return overridden
}

/**
 * `entries` without the ones the effect tag stacking rule overrides (see {@link findOverriddenByTag}),
 * in their original order.
 *
 * @example
 * // A Power Focus (+2) and a Spellcasting Focus (+3), both tagged "focus": only the +3 is kept.
 * keepHighestPerTag(effects, { getTags: (effect) => effect.tags, getValue: (effect) => effect.value })
 */
export function keepHighestPerTag<T>(entries: readonly T[], options: EffectTagStackingOptions<T>): T[] {
  const overridden = findOverriddenByTag(entries, options)
  return entries.filter((entry) => !overridden.has(entry))
}
