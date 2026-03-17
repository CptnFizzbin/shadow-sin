import MuiTextField, {
	type TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";
import type { FC } from "react";
import { useFieldContext } from "../FieldContext.ts";

interface TextFieldProps
	extends Omit<MuiTextFieldProps, "value" | "onChange" | "onBlur"> {}

export const TextField: FC<TextFieldProps> = ({ ...props }) => {
	const field = useFieldContext<any>();

	// Ensure controlled input — fallback to empty string when undefined
	const value = field.state.value ?? "";

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const v = e.target.value;
		if ((props as any).type === "number") {
			field.handleChange(v === "" ? undefined : Number(v));
			return;
		}
		field.handleChange(v);
	};

	return (
		<MuiTextField
			fullWidth
			variant="outlined"
			size="small"
			{...props}
			value={value}
			onBlur={field.handleBlur}
			onChange={handleChange}
		/>
	);
};
