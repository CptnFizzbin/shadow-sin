import Typography from "@mui/material/Typography";
import type { FC, ReactNode } from "react";

interface LabelProps {
	label: ReactNode;
	variant?: "contained" | "outlined";
	textAlign?: "center" | "left" | "right";
	color?: string;
	textColor?: string;
}

export const Label: FC<LabelProps> = ({
	label,
	textAlign = "center",
	variant = "contained",
	color = "secondary.dark",
	textColor = "common.white",
}) => {
	const styles =
		variant === "contained"
			? {
					backgroundColor: color,
					color: textColor,
				}
			: {
					border: "1px solid",
					borderColor: color,
					color: color,
				};

	return (
		<Typography
			variant="caption"
			sx={[{ display: "block", width: "100%" }, styles, { textAlign }]}
		>
			{label}
		</Typography>
	);
};
