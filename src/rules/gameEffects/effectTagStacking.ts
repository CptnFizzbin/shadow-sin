interface EffectTagStackingOptions<T> {
  getTags: (entry: T) => readonly string[] | undefined
  getValue: (entry: T) => number
  /** Entries only compete with others in the same group (e.g. the same target); all compete by default. */
  getGroupKey?: (entry: T) => string
}

/** Why a dice group or rating Modifier doesn't count: the one counted in its place, and the tag they share. */
export interface OverrideReason {
  /** The name of the overriding group or Modifier, e.g. the Focus it comes from. */
  name: string
  value: number
  tag: string
}

/** Why an entry is overridden: the entry that applies in its place, and the stacking tag they share. */
export interface TagOverride<T> {
  by: T
  tag: string
}

/**
 * The entries the effect tag stacking rule overrides, each with the entry that overrides it. Entries
 * that share a tag don't stack: going from the highest value down (earlier entries first on a tie),
 * an entry applies unless one of its tags is already held by an entry that applies. An entry with
 * no tags always applies.
 */
export function findOverriddenByTag<T>(
  entries: readonly T[],
  options: EffectTagStackingOptions<T>,
): Map<T, TagOverride<T>> {
  const { getTags, getValue, getGroupKey = () => "" } = options
  const tagsOf = (entry: T) => (getTags(entry) ?? [])
    .filter((tag) => tag !== "")
    .map((tag) => ({ tag, key: JSON.stringify([getGroupKey(entry), tag]) }))

  const holders = new Map<string, T>()
  const overridden = new Map<T, TagOverride<T>>()
  const highestFirst = entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => getValue(b.entry) - getValue(a.entry) || a.index - b.index)

  for (const { entry } of highestFirst) {
    const tags = tagsOf(entry)
    const held = tags.find(({ key }) => holders.has(key))
    if (held) {
      overridden.set(entry, { by: holders.get(held.key)!, tag: held.tag })
      continue
    }
    tags.forEach(({ key }) => holders.set(key, entry))
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
