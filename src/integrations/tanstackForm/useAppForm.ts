import { createFormHook } from "@tanstack/react-form"

import { fieldContext, formContext } from "#/integrations/tanstackForm/fieldContext.ts"
import { CheckboxField } from "#/integrations/tanstackForm/fields/checkboxField.tsx"
import { CounterField } from "#/integrations/tanstackForm/fields/counterField.tsx"
import { NumberField } from "#/integrations/tanstackForm/fields/numberField.tsx"
import { NuyenField } from "#/integrations/tanstackForm/fields/nuyenField.tsx"
import { SelectField } from "#/integrations/tanstackForm/fields/selectField.tsx"
import { SwitchField } from "#/integrations/tanstackForm/fields/switchField.tsx"
import { TextField } from "#/integrations/tanstackForm/fields/textField.tsx"

export const { useAppForm, withFieldGroup } = createFormHook({
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
