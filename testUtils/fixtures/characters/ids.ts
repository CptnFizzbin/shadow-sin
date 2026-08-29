/**
 * Stable UUIDs shared across the legacy character-sheet fixtures in this directory, so tests can
 * reference specific characters/items across migration boundaries.
 */

// Shared across all `characterV1*` version fixtures.
export const TEST_CHARACTER_ID = "ccccdddd-0000-0000-0000-000000000001" as const
export const TEST_WEAPON_ID = "ccccdddd-0000-0000-0000-000000000002" as const
export const TEST_VEHICLE_ID = "ccccdddd-0000-0000-0000-000000000003" as const
export const TEST_LOAN_ID = "ccccdddd-0000-0000-0000-000000000004" as const

// For the old-format (`characterV0`) fixture.
export const TEST_OLD_FORMAT_CHARACTER_ID = "00000000-0000-0000-0000-000000000000" as const
export const TEST_OLD_FORMAT_SIN_ID = "7ad0eba6-e9b1-4b0b-83cf-ee30c560e672" as const
export const TEST_OLD_FORMAT_LICENSE_ID = "89f99b5a-b065-4827-9bfd-50d7396f07ed" as const
