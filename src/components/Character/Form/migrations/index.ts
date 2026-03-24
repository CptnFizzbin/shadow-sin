import type { FormStateMigration } from "#/components/Character/Form/FormStateMigration.ts"

/**
 * Ordered list of character builder draft state migrations. Each entry
 * transforms the serialised localStorage value from the previous schema to
 * the next. Migrations are applied in ascending version order when the stored
 * version is older than the current one.
 *
 * Add new migrations at the end of this array; do NOT remove or reorder
 * existing entries so that older persisted states can always be upgraded.
 *
 * The `any` types are intentional: each migration may receive an input with
 * an unknown prior schema and must produce output that the next migration (or
 * the current BuilderState) can accept.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const formStateMigrations: FormStateMigration<any, any>[] = []
