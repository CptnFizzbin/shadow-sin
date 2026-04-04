import { createFieldMap, formOptions } from "@tanstack/form-core"

import { useAppForm } from "#/integrations/tanstack-form/use-app-form.ts"
import type { ContactData } from "#/lib/system/contact-data.ts"
import { NullUuid } from "#/lib/uuid-utils.ts"

const defaultValues: ContactData = {
  id: NullUuid,
  name: "",
  connection: 1,
  loyalty: 1,
  notes: "",
}

export const contactFieldMap = createFieldMap(defaultValues)

export const contactFormOpts = formOptions({
  defaultValues,
})

export type ContactFormOptions = {
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
