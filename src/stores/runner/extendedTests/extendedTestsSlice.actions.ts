import { createAction } from "@reduxjs/toolkit"

import type { UUID } from "#/lib/uuidUtils.ts"
import type { ExtendedTestEntry } from "#/system/extendedTestData.ts"

export const addExtendedTest = createAction("extendedTests/add", (test: Omit<ExtendedTestEntry, "id">) => {
  return { payload: { ...test, id: crypto.randomUUID() as UUID } }
})

export const updateExtendedTest = createAction<ExtendedTestEntry>("extendedTests/update")
export const removeExtendedTest = createAction<UUID>("extendedTests/remove")
export const setExtendedTestHits = createAction<{ id: UUID, hits: number }>("extendedTests/setHits")
export const setExtendedTestAttempts = createAction<{ id: UUID, attempts: number }>("extendedTests/setAttempts")

export const TestTrackerActions = {
  add: addExtendedTest,
  update: updateExtendedTest,
  remove: removeExtendedTest,
  setHits: setExtendedTestHits,
  setAttemps: setExtendedTestAttempts,
}
