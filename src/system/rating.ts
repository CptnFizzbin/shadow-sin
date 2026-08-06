/**
 * The strength/level of an Entity (Armor's protection, an Adept Power's rating, a Spirit's
 * Force, ...). `TSentinel` lets a specific field admit its own unrated/default case instead of a
 * number — e.g. `Rating<"real">` for a Real SIN/Licence, `Rating<"native">` for a native Language
 * skill — while every other consumer stays a plain number.
 */
export type Rating<TSentinel extends string = never> = number | TSentinel
