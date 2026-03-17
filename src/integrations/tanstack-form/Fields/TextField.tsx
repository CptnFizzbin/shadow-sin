import MuiTextField, {
  type TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import type { FC } from "react";
import { useFieldContext } from "../FieldContext.ts";

interface TextFieldProps
  extends Omit<MuiTextFieldProps, "value" | "onChange" | "onBlur"> {}

export const TextField: FC<TextFieldProps> = ({ ...props }) => {
  const field = useFieldContext<string>();

  return (
    <MuiTextField
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      value={field.state.value}
      onBlur={field.handleBlur}
      onChange={(e) => field.handleChange(e.target.value)}
    />
  );
};
