import { createAction } from "@reduxjs/toolkit"

import { NullUuid } from "#/common/uuid/uuidUtils.ts"
import type { ComplexFormData } from "#/data/magic/complexFormData.ts"

export const addComplexForm = createAction<ComplexFormData>("complexForms/add")
export const updateComplexForm = createAction<ComplexFormData>("complexForms/update")
export const removeComplexForm = createAction<string>("complexForms/remove")

export const saveComplexForm = createAction("complexForms/save", (form: ComplexFormData) => {
  if (!form.id || form.id === NullUuid) {
    return { payload: { ...form, id: crypto.randomUUID() } }
  }
  return { payload: form }
})
