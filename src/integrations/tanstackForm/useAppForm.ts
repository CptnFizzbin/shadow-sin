import { createFormHook } from "@tanstack/react-form"

import { fieldContext, formContext } from "./fieldContext.ts"
import { CheckboxField } from "./fields/checkboxField.tsx"
import { CounterField } from "./fields/counterField.tsx"
import { NumberField } from "./fields/numberField.tsx"
import { NuyenField } from "./fields/nuyenField.tsx"
import { SelectField } from "./fields/selectField.tsx"
import { SwitchField } from "./fields/switchField.tsx"
import { TextField } from "./fields/textField.tsx"

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
