import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts"
import type { ContactData } from "#/lib/system/types/contactData.ts"

const defaultValues = {
  id: "",
  name: "",
  connection: 1 as number | undefined,
  loyalty: 1 as number | undefined,
  notes: "",
}

export const contactFieldMap = createFieldMap(defaultValues)

export const contactFormOpts = formOptions({
  defaultValues,
})

export type ContactEditFormOptions = {
  mode: "edit"
  contact: ContactData
  onSubmit: (contact: ContactData) => void
}

export type ContactCreateFormOptions = {
  mode: "create"
  onSubmit: (contact: ContactData) => void
}

export type ContactFormOptions =
  | ContactEditFormOptions
  | ContactCreateFormOptions

export const useContactForm = (options: ContactFormOptions) => {
  const { mode } = options

  let defaultVals: typeof defaultValues

  if (mode === "edit") {
    const { contact } = options
    defaultVals = {
      id: contact.id,
      name: contact.name,
      connection: contact.connection,
      loyalty: contact.loyalty,
      notes: contact.notes ?? "",
    }
  } else {
    defaultVals = {
      id: crypto.randomUUID(),
      name: "",
      connection: 1,
      loyalty: 1,
      notes: "",
    }
  }

  return useAppForm({
    ...contactFormOpts,
    defaultValues: defaultVals,
    onSubmit: ({ value }) => {
      options.onSubmit({
        id: value.id,
        name: value.name,
        connection: Math.min(6, Math.max(1, value.connection ?? 1)),
        loyalty: Math.min(6, Math.max(1, value.loyalty ?? 1)),
        notes: value.notes || undefined,
      })
    },
  })
}
