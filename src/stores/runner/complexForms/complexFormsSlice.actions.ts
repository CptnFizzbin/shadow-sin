import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

export const addComplexForm = createAction<ComplexFormData>("complexForms/add")
export const updateComplexForm = createAction<ComplexFormData>("complexForms/update")
export const removeComplexForm = createAction<string>("complexForms/remove")

export const saveComplexForm = createAction("complexForms/save", (form: ComplexFormData) => {
  if (!form.id || form.id === NullUuid) {
    return { payload: { ...form, id: crypto.randomUUID() } }
  }
  return { payload: form }
})
