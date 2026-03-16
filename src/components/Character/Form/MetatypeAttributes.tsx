import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useStore } from "@tanstack/react-store";
import type { FC } from "react";
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts";
import { Label } from "#/components/UI/Text/Label.tsx";
import {
	type AttributeKey,
	AttributeLabels,
	MentalAttributes,
	PhysicalAttributes,
	SpecialAttributes,
} from "#/lib/system/types/attributeKey.ts";
import { metatypes } from "#/lib/system/types/MetatypeData.ts";

interface MetatypeAttributesProps {
	form: PlayerCharacterForm;
}

export const MetatypeAttributes: FC<MetatypeAttributesProps> = ({ form }) => {
	return (
		<Stack gap={1}>
			<Label label={"starting / max (augmented max)"} variant="outlined" />

			<Stack gap={0.5}>
				<AttrList attrKeys={PhysicalAttributes} form={form} />
			</Stack>

			<Stack gap={0.5}>
				<AttrList attrKeys={MentalAttributes} form={form} />
			</Stack>

			<Stack gap={0.5}>
				<AttrList attrKeys={SpecialAttributes} form={form} />
			</Stack>
		</Stack>
	);
};

interface AttrListProps {
	form: PlayerCharacterForm;
	attrKeys: AttributeKey[];
}

const AttrList: FC<AttrListProps> = ({ attrKeys, form }) => {
	const metatypeName = useStore(form.store, (state) => state.values.metatype);
	const metatype = metatypes[metatypeName];

	const attributes = attrKeys
		.map((key) => {
			const metatypeAttr = metatype.attributes[key];
			return {
				key: key,
				label: AttributeLabels[key],
				value: metatypeAttr.value,
				max: metatypeAttr.max,
				augMax: metatypeAttr.augMax,
			};
		})
		.filter((attr) => attr.value !== 0);

	return (
		<Stack direction={"row"} gap={0.5}>
			{attributes.map((attr) => (
				<Stack key={attr.key} flexGrow={1} alignItems={"center"}>
					<Label label={attr.label} variant="outlined" />
					<Typography variant="body2">
						{attr.value}/{attr.max} {attr.augMax && <>({attr.augMax})</>}
					</Typography>
				</Stack>
			))}
		</Stack>
	);
};
