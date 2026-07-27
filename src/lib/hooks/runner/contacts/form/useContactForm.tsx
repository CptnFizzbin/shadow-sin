import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstackForm/useAppForm.ts"
import { NullUuid } from "#/lib/uuidUtils.ts"
import type { ContactData } from "#/system/contactData.ts"

const defaultValues: ContactData = {
  id: NullUuid,
  name: "",
  connection: 1,
  loyalty: 1,
  notes: "",
  knowledgeSkills: [],
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
    onSubmit: ({ value }) => options.onSubmit({
      ...value,
      // SelectField stores values as strings, so ratings need converting back to numbers
      connection: Number(value.connection),
      loyalty: Number(value.loyalty),
    }),
  })
}
