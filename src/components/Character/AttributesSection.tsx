import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FC } from "react";
import { useCharacterStore } from "#/components/Character/CharacterStoreProvider.tsx";
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts";
import { AttributeLabels } from "#/lib/system/types/attributeKey.ts";

const physical: AttributeKey[] = ["body", "agility", "reaction", "strength"];
const mental: AttributeKey[] = ["charisma", "logic", "intuition", "willpower"];
const special: AttributeKey[] = ["edge", "essence", "magic", "resonance"];

const renderAttrList = (
	attrs: Record<string, number> | undefined,
	keys: AttributeKey[],
) => {
	if (!attrs) return null;
	const attributes = keys
		.map((k) => ({ key: k, value: attrs[k] }))
		.filter((it) => it.value !== 0);

	if (attributes.length === 0) return null;

	return (
		<Box
			sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}
		>
			{attributes.map((attribute) => (
				<Stack key={attribute.key} flexGrow={1} alignItems={"center"}>
					<Typography
						variant="caption"
						sx={{
							backgroundColor: "secondary.dark",
							width: "100%",
							textAlign: "center",
						}}
					>
						{AttributeLabels[attribute.key]}
					</Typography>
					<Typography variant="body2">{attribute.value}</Typography>
				</Stack>
			))}
		</Box>
	);
};

export const AttributesSection: FC = () => {
	const attributes = useCharacterStore((s) => s.attributes);

	return (
		<Box>
			{renderAttrList(attributes, physical) && (
				<Box sx={{ marginBottom: 0.5 }}>
					<Typography variant="subtitle2">Physical</Typography>
					{renderAttrList(attributes, physical)}
				</Box>
			)}

			{renderAttrList(attributes, mental) && (
				<Box sx={{ marginBottom: 0.5 }}>
					<Typography variant="subtitle2">Mental</Typography>
					{renderAttrList(attributes, mental)}
				</Box>
			)}

			{renderAttrList(attributes, special) && (
				<Box sx={{ marginBottom: 0.5 }}>
					<Typography variant="subtitle2">Special</Typography>
					{renderAttrList(attributes, special)}
				</Box>
			)}
		</Box>
	);
};
