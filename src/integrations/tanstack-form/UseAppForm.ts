import { createFormHook } from "@tanstack/react-form";
import { SelectField } from "#/integrations/tanstack-form/Fields/SelectField.tsx";
import { TextField } from "#/integrations/tanstack-form/Fields/TextField.tsx";
import { fieldContext, formContext } from "./FieldContext.ts";

export const { useAppForm, withFieldGroup } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
  },
  formComponents: {},
  fieldContext,
  formContext,
});
