import { createFormHook } from "@tanstack/react-form"

import { NumberField } from "#/integrations/tanstackForm/fields/numberField.tsx"
import { SelectField } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { TextField } from "#/integrations/tanstackForm/fields/textField.tsx"
import { fieldContext, formContext } from "./fieldContext.ts"

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
