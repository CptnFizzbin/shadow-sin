import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import MuiTextField from "@mui/material/TextField";
import { type FC, useEffect, useState } from "react";
import { SourceField } from "#/components/Character/Form/Qualities/SourceField.tsx";
import type { QualityData } from "#/lib/system/types/qualityData.ts";

export interface QualityDialogProps {
	quality: QualityData;
	open: boolean;
	onClose: () => void;
	onSave: (updated: QualityData) => void;
	onDelete: () => void;
}

export const QualityDialog: FC<QualityDialogProps> = ({
	quality,
	open,
	onClose,
	onSave,
	onDelete,
}) => {
	const [editedQuality, setEditedQuality] = useState<QualityData>(quality);

	useEffect(() => {
		setEditedQuality(quality);
	}, [quality]);

	const updateField = <FieldKey extends keyof QualityData>(
		field: FieldKey,
		value: QualityData[FieldKey],
	) => {
		setEditedQuality((prev) => ({ ...prev, [field]: value }));
	};

	const handleSave = () => {
		onSave(editedQuality);
		onClose();
	};

	const handleDelete = () => {
		onDelete();
		onClose();
	};

	const sourceBook = editedQuality.source?.book ?? "";
	const sourcePage = editedQuality.source?.page?.toString() ?? "";

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>
				{editedQuality.positive ? "Positive Quality" : "Negative Quality"}
			</DialogTitle>
			<DialogContent>
				<Stack gap={2} sx={{ pt: 1 }}>
					<MuiTextField
						label="Name"
						size="small"
						fullWidth
						value={editedQuality.name}
						onChange={(e) => updateField("name", e.target.value)}
						required
					/>

					<FormControlLabel
						control={
							<Switch
								checked={editedQuality.positive}
								onChange={(e) => updateField("positive", e.target.checked)}
							/>
						}
						label={
							editedQuality.positive
								? "Positive quality (costs BP)"
								: "Negative quality (grants BP)"
						}
					/>

					<MuiTextField
						label="BP Cost"
						size="small"
						type="number"
						fullWidth
						value={editedQuality.cost ?? ""}
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
						value={editedQuality.description}
						onChange={(e) => updateField("description", e.target.value)}
					/>

					<SourceField
						book={sourceBook}
						page={sourcePage}
						onBookChange={(book) =>
							setEditedQuality((prev) => ({
								...prev,
								source: book
									? { book, page: Number(sourcePage) || 0 }
									: undefined,
							}))
						}
						onPageChange={(page) =>
							setEditedQuality((prev) => ({
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
				<Button color="error" onClick={handleDelete}>
					Delete
				</Button>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					onClick={handleSave}
					disabled={!editedQuality.name.trim()}
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
};
