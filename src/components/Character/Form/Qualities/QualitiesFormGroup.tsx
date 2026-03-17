import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { RiAddLine } from "@remixicon/react";
import { type FC, useState } from "react";
import { AddQualityDialog } from "#/components/Character/Form/Qualities/AddQualityDialog.tsx";
import { QualityDialog } from "#/components/Character/Form/Qualities/QualityDialog.tsx";
import { QualityRow } from "#/components/Character/Form/Qualities/QualityRow.tsx";
import { useQualitiesFormGroup } from "#/components/Character/Form/Qualities/UseQualitiesFormGroup.ts";
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts";
import type { QualityData } from "#/lib/system/types/qualityData.ts";

export interface QualitiesFormGroupProps {
	form: PlayerCharacterForm;
}

export const QualitiesFormGroup: FC<QualitiesFormGroupProps> = ({ form }) => {
	const {
		positiveQualities,
		negativeQualities,
		positiveBPSpent,
		negativeBPGranted,
		netBPSpent,
		addQuality,
		updateQuality,
		removeQuality,
	} = useQualitiesFormGroup(form);

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [selectedEntry, setSelectedEntry] = useState<{
		quality: QualityData;
		index: number;
	} | null>(null);

	const handleQualitySave = (updated: QualityData) => {
		if (selectedEntry !== null) {
			updateQuality(selectedEntry.index, updated);
		}
	};

	const handleQualityDelete = () => {
		if (selectedEntry !== null) {
			removeQuality(selectedEntry.index);
		}
	};

	const netBPLabel =
		netBPSpent >= 0
			? `${netBPSpent} BP spent`
			: `${Math.abs(netBPSpent)} BP gained`;

	return (
		<>
			<Stack gap={1}>
				<Typography variant="caption">
					{netBPLabel} ({positiveBPSpent} positive, {negativeBPGranted}{" "}
					negative)
				</Typography>

				<Typography variant="subtitle2">Positive Qualities</Typography>

				{positiveQualities.length === 0 ? (
					<Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
						No positive qualities added
					</Typography>
				) : (
					<Stack gap={0.5}>
						{positiveQualities.map(({ quality, index }) => (
							<QualityRow
								key={quality.id ?? index}
								quality={quality}
								onClick={() => setSelectedEntry({ quality, index })}
							/>
						))}
					</Stack>
				)}

				<Divider />

				<Typography variant="subtitle2">Negative Qualities</Typography>

				{negativeQualities.length === 0 ? (
					<Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
						No negative qualities added
					</Typography>
				) : (
					<Stack gap={0.5}>
						{negativeQualities.map(({ quality, index }) => (
							<QualityRow
								key={quality.id ?? index}
								quality={quality}
								onClick={() => setSelectedEntry({ quality, index })}
							/>
						))}
					</Stack>
				)}

				<Button
					variant="outlined"
					startIcon={<RiAddLine />}
					onClick={() => setIsAddDialogOpen(true)}
					size="small"
				>
					Add Quality
				</Button>
			</Stack>

			<AddQualityDialog
				open={isAddDialogOpen}
				onClose={() => setIsAddDialogOpen(false)}
				onAdd={addQuality}
			/>

			{selectedEntry !== null && (
				<QualityDialog
					quality={selectedEntry.quality}
					open={selectedEntry !== null}
					onClose={() => setSelectedEntry(null)}
					onSave={handleQualitySave}
					onDelete={handleQualityDelete}
				/>
			)}
		</>
	);
};
