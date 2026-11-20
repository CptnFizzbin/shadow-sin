import type { SourceData } from "#/system/model/sourceData.ts"

/** A value a feature flag can hold. */
export type FlagValue = string | boolean

/** One selectable value of a {@link FlagData} with `options`. */
export interface FlagOption<Value extends FlagValue = FlagValue> {
  readonly value: Value
  /** Display label shown in the UI. */
  readonly label: string
}

/** Defines a single feature flag: a named, typed setting with a default value. */
export interface FlagData<Value extends FlagValue = FlagValue> {
  /** Display name shown in the UI. */
  readonly name: string
  /** Human-readable explanation of what this setting does. */
  readonly description?: string
  /** The rulebook and page where this option is defined, when it comes from one. */
  readonly source?: SourceData
  /** The value used when a Runner has no override for this flag. */
  readonly default: Value
  /** The values the flag may take, when it is limited to a fixed set. */
  readonly options?: readonly FlagOption<Value>[]
}

/** A registered {@link FlagData}, addressable by its namespaced `ref`. */
export interface FlagEntry<Value extends FlagValue = FlagValue> extends FlagData<Value> {
  /** The flag's key in `RunnerData`'s feature flags: `<namespace>.<key>`. */
  readonly ref: string
}

type WidenFlagValue<Value extends FlagValue> = Value extends boolean ? boolean : string

/** The registry {@link createFlagRegistry} builds from `namespace` and `Flags`. */
export type FlagRegistry<Namespace extends string, Flags extends Record<string, FlagData>> = {
  readonly [Key in keyof Flags & string]: Flags[Key]
    & FlagEntry<WidenFlagValue<Flags[Key]["default"]>>
    & { readonly ref: `${Namespace}.${Key}` }
}

/**
 * Builds a registry of feature flags whose `ref`s are prefixed with `namespace`.
 *
 * @example
 * const houseRules = createFlagRegistry("houseRules", {
 *   "karma.nuyenExchange": { name: "Karma–Nuyen Exchange", default: true },
 * })
 * houseRules["karma.nuyenExchange"].ref // "houseRules.karma.nuyenExchange"
 */
export function createFlagRegistry<Namespace extends string, Flags extends Record<string, FlagData>>(
  namespace: Namespace,
  flags: Flags,
): FlagRegistry<Namespace, Flags> {
  const entries = Object.entries(flags).map(([key, flag]) => [key, { ...flag, ref: `${namespace}.${key}` }])
  return Object.fromEntries(entries) as FlagRegistry<Namespace, Flags>
}
