import { createFieldMap, formOptions } from "@tanstack/form-core"

import { NullUuid } from "#common/uuid/uuidUtils.ts"
import type { ContactData } from "#data/contacts/contactData.ts"
import { useAppForm } from "#forms/tanstackForm/useAppForm.ts"

const defaultValues: ContactData = {
  id: NullUuid,
  name: "",
  connection: 1,
  loyalty: 1,
  notes: "",
  skills: [],
  favours: [],
}

export const contactFieldMap = createFieldMap(defaultValues)

export const contactFormOpts = formOptions({
  defaultValues,
})

type ContactFormOptions = {
  contact?: ContactData
  onSubmit: (contact: ContactData) => void
}

export const useContactForm = (options: ContactFormOptions) => {
  return useAppForm({
    ...contactFormOpts,
    defaultValues: {
      ...defaultValues,
      ...options.contact,
    },
    onSubmit: ({ value }) => options.onSubmit(value),
  })
}
