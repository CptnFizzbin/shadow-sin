import { createFormHook } from "@tanstack/react-form"
import { NumberField } from "#/integrations/tanstack-form/Fields/NumberField.tsx"
import { SelectField } from "#/integrations/tanstack-form/Fields/SelectField.tsx"
import { TextField } from "#/integrations/tanstack-form/Fields/TextField.tsx"
import { fieldContext, formContext } from "./FieldContext.ts"

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    NumberField,
    SelectField,
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
})
