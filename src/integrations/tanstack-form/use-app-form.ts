import { createFormHook } from "@tanstack/react-form"

import { NumberField } from "#/integrations/tanstack-form/Fields/number-field.tsx"
import { SelectField } from "#/integrations/tanstack-form/Fields/select-field.tsx"
import { TextField } from "#/integrations/tanstack-form/Fields/text-field.tsx"
import { fieldContext, formContext } from "./field-context.ts"

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    NumberField,
    SelectField,
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
})
