import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { FC } from "react";

import { useCharacterStore } from "#/components/Character/CharacterStoreProvider.tsx";

export const ProfileSection: FC = () => {
	const profile = useCharacterStore((s) => s.profile);
	const biology = useCharacterStore((s) => s.biology);

	return (
		<Box>
			<Typography variant="h4">{profile?.alias || profile?.name}</Typography>
			<Typography variant="subtitle2" color="text.secondary">
				{profile?.archetype || biology?.metatype}
			</Typography>

			<Typography variant="body2">Name: {profile?.name}</Typography>
			{profile?.description && (
				<Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
					{profile.description}
				</Typography>
			)}

			{profile?.lifestyle && (
				<Typography variant="body2">
					Lifestyle: Q{profile.lifestyle.quality} — {profile.lifestyle.cost}¥ /
					m
				</Typography>
			)}
		</Box>
	);
};
