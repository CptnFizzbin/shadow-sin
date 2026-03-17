import type { FC } from "react";

import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm";

export interface ProfileFormGroupProps {
	form: PlayerCharacterForm;
}

export const ProfileFormGroup: FC<ProfileFormGroupProps> = ({ form }) => {
	return (
		<>
			<form.AppField
				name="alias"
				children={(field) => <field.TextField label="Alias" />}
			/>

			<form.AppField
				name="name"
				children={(field) => <field.TextField label="Name" />}
			/>
		</>
	);
};
