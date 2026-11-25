import { createContext } from "react"

import type { EntityData } from "#/system/model/entities/entityData.ts"

/**
 * The Entity currently in scope for `useEntitySelector`. Kept as `object` rather than
 * `EntityBase` — not every Entity kind this can hold (e.g. Spirit/Sprite, which have no `source`
 * field and don't use `EntityData.rating`) structurally satisfies `EntityData`'s full shape.
 * Callers narrow to whatever trait(s) their selector's `TState` needs (`EntityWithAttrs`, ...),
 * the same way `useRunnerSelector` narrows `RunnerData`.
 */
export const EntityContext = createContext<EntityData | null>(null)
