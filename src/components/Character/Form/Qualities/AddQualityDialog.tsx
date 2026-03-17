import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import MuiTextField from "@mui/material/TextField";
import { type FC, useState } from "react";
import { SourceField } from "#/components/Character/Form/Qualities/SourceField.tsx";
import type { QualityData } from "#/lib/system/types/qualityData.ts";

export interface AddQualityDialogProps {
	open: boolean;
	onClose: () => void;
	onAdd: (quality: QualityData) => void;
}

const createEmptyQuality = (): QualityData => ({
	id: crypto.randomUUID(),
	name: "",
	positive: true,
	description: "",
});

export const AddQualityDialog: FC<AddQualityDialogProps> = ({
	open,
	onClose,
	onAdd,
}) => {
	const [quality, setQuality] = useState<QualityData>(createEmptyQuality);

	const handleClose = () => {
		setQuality(createEmptyQuality());
		onClose();
	};

	const handleAdd = () => {
		if (!quality.name.trim()) return;
		onAdd(quality);
		setQuality(createEmptyQuality());
		onClose();
	};

	const updateField = <FieldKey extends keyof QualityData>(
		field: FieldKey,
		value: QualityData[FieldKey],
	) => {
		setQuality((prev) => ({ ...prev, [field]: value }));
	};

	const sourceBook = quality.source?.book ?? "";
	const sourcePage = quality.source?.page?.toString() ?? "";

	return (
		<Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
			<DialogTitle>Add Quality</DialogTitle>
			<DialogContent>
				<Stack gap={2} sx={{ pt: 1 }}>
					<MuiTextField
						label="Name"
						size="small"
						fullWidth
						value={quality.name}
						onChange={(e) => updateField("name", e.target.value)}
						required
					/>

					<FormControlLabel
						control={
							<Switch
								checked={quality.positive}
								onChange={(e) => updateField("positive", e.target.checked)}
							/>
						}
						label={
							quality.positive
								? "Positive quality (costs BP)"
								: "Negative quality (grants BP)"
						}
					/>

					<MuiTextField
						label="BP Cost"
						size="small"
						type="number"
						fullWidth
						value={quality.cost ?? ""}
						onChange={(e) =>
							updateField(
								"cost",
								e.target.value === "" ? undefined : Number(e.target.value),
							)
						}
						slotProps={{ htmlInput: { min: 0 } }}
					/>

					<MuiTextField
						label="Description"
						size="small"
						fullWidth
						multiline
						rows={4}
						value={quality.description}
						onChange={(e) => updateField("description", e.target.value)}
					/>

					<SourceField
						book={sourceBook}
						page={sourcePage}
						onBookChange={(book) =>
							setQuality((prev) => ({
								...prev,
								source: book
									? { book, page: Number(sourcePage) || 0 }
									: undefined,
							}))
						}
						onPageChange={(page) =>
							setQuality((prev) => ({
								...prev,
								source: sourceBook
									? { book: sourceBook, page: Number(page) || 0 }
									: undefined,
							}))
						}
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button
					variant="contained"
					onClick={handleAdd}
					disabled={!quality.name.trim()}
				>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
};
