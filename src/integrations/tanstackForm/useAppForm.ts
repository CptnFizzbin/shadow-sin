import { createFormHook } from "@tanstack/react-form"

import { CounterField } from "#/integrations/tanstackForm/fields/counterField.tsx"
import { NumberField } from "#/integrations/tanstackForm/fields/numberField.tsx"
import { SelectField } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { TextField } from "#/integrations/tanstackForm/fields/textField.tsx"
import { fieldContext, formContext } from "./fieldContext.ts"

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    CounterField,
    NumberField,
    SelectField,
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
})
