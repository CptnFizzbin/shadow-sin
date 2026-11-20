import type { SourceData } from "#/system/model/sourceData.ts"

/**
 * Classifies a {@link FeatureFlag}:
 *
 * - `"optionalRule"` — a published variant rule from a Shadowrun source book that a table opts into.
 * - `"houseRule"` — an app-invented design choice with no source book behind it.
 *
 * The type also decides which `FeatureFlagsData` namespace stores the flag's override.
 */
export type FeatureFlagType = "optionalRule" | "houseRule"

/**
 * Describes a single feature flag — a named, typed setting with a default value.
 *
 * @template Value - The type of the flag's value. Defaults to `boolean`.
 * @template Type - The flag's {@link FeatureFlagType}.
 */
export interface FeatureFlag<Value = boolean, Type extends FeatureFlagType = FeatureFlagType> {
  /** Whether this is an Optional Rule or a House Rule. */
  readonly type: Type
  /** Display name shown in the UI. */
  readonly name: string
  /** Human-readable explanation of what this setting does. */
  readonly description?: string
  /** The rulebook and page where this option is defined, when it comes from one. */
  readonly source?: SourceData
  /** The value used when a Runner has no override for this flag. */
  readonly defaultValue: Value
}

/** Intentional widening — AnyFeatureFlag must accept FeatureFlag<V> for every concrete V in the registry. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFeatureFlag = FeatureFlag<any>

/**
 * Factory for defining a {@link FeatureFlag} entry in a registry.
 * Infers the flag's value type from `config.defaultValue` and keeps `config.type` as a literal.
 *
 * @example
 * const encumbrance = createFlag({
 *   type: "optionalRule",
 *   name: "Encumbrance",
 *   source: { book: "SR4A", page: 161 },
 *   defaultValue: false,
 * })
 */
export function createFlag<Value, Type extends FeatureFlagType>(
  config: FeatureFlag<Value, Type>,
): FeatureFlag<Value, Type> {
  return config
}

/**
 * Extracts the value type `V` from a {@link FeatureFlag}<V>.
 *
 * @example
 * type Entry = FeatureFlag<boolean>
 * type Val = FeatureFlagValue<Entry> // boolean
 */
export type FeatureFlagValue<F extends FeatureFlag<unknown>> =
  F extends FeatureFlag<infer V>
    ? V
    : never
