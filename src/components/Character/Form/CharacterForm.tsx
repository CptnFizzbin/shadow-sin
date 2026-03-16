import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { FC } from "react";
import { MetatypeAttributes } from "#/components/Character/Form/MetatypeAttributes.tsx";
import {
	type PlayerCharacterForm,
	useCharacterForm,
} from "#/components/Character/Form/UseCharacterForm.ts";
import { metatypes } from "#/lib/system/types/MetatypeData.ts";
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts";

interface CharacterFormProps {
	character?: PlayerCharacterData;
}

export const CharacterForm: FC<CharacterFormProps> = ({ character }) => {
	const form: PlayerCharacterForm = useCharacterForm(character);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Stack gap={1}>
				<Paper sx={{ padding: 1 }}>
					<Stack gap={1}>
						<Typography variant="h6" sx={{ textAlign: "center" }}>
							Profile
						</Typography>

						<form.AppField
							name="alias"
							children={(field) => <field.TextField label="Alias" />}
						/>

						<form.AppField
							name="name"
							children={(field) => <field.TextField label="Name" />}
						/>
					</Stack>
				</Paper>

				<Paper sx={{ padding: 1 }}>
					<Stack gap={1}>
						<Typography variant="h6" sx={{ textAlign: "center" }}>
							Biology
						</Typography>

						<form.AppField
							name="metatype"
							children={(field) => (
								<field.SelectField
									label="Metatype"
									size="small"
									options={Object.values(metatypes).map(({ name, cost }) => {
										return {
											value: name,
											label: (
												<Stack
													direction={"row"}
													justifyContent={"space-between"}
													width="100%"
												>
													<Typography>{name}</Typography>
													<Typography
														variant={"subtitle2"}
														color="secondary.main"
													>
														{cost} BP
													</Typography>
												</Stack>
											),
										};
									})}
								/>
							)}
						/>

						<MetatypeAttributes form={form} />
					</Stack>
				</Paper>
			</Stack>
		</form>
	);
};
