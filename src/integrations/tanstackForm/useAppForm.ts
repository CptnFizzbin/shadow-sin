import { createFormHook } from "@tanstack/react-form"

import { CheckboxField } from "#/integrations/tanstackForm/fields/checkboxField.tsx"
import { CounterField } from "#/integrations/tanstackForm/fields/counterField.tsx"
import { NumberField } from "#/integrations/tanstackForm/fields/numberField.tsx"
import { NuyenField } from "#/integrations/tanstackForm/fields/nuyenField.tsx"
import { SelectField } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { SwitchField } from "#/integrations/tanstackForm/fields/switchField.tsx"
import { TextField } from "#/integrations/tanstackForm/fields/textField.tsx"
import { fieldContext, formContext } from "./fieldContext.ts"

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    CheckboxField,
    CounterField,
    NumberField,
    NuyenField,
    SelectField,
    SwitchField,
    TextField,
  },
  formComponents: {},
  fieldContext,
  formContext,
})
