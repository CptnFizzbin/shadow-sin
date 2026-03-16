import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts";
import { AwakeningType } from "#/lib/system/types/awakeningType.ts";
import { LifestyleType } from "#/lib/system/types/LifestyleType.ts";
import { MetatypeKey } from "#/lib/system/types/MetatypeData.ts";
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts";

export const useCharacterForm = (character?: PlayerCharacterData) => {
	const { profile, biology, attributes } = character || {};

	return useAppForm({
		defaultValues: {
			name: profile?.name || "",
			alias: profile?.alias || "",
			lifestyle: profile?.lifestyle?.quality || LifestyleType.Low,
			age: biology?.age || 0,
			metatype: biology?.metatype || MetatypeKey.Human,
			awakening: biology?.awakening || AwakeningType.mundane,

			attributes: {
				body: attributes?.body || 1,
				agility: attributes?.agility || 1,
				reaction: attributes?.reaction || 1,
				strength: attributes?.strength || 1,

				charisma: attributes?.charisma || 1,
				intuition: attributes?.intuition || 1,
				logic: attributes?.logic || 1,
				willpower: attributes?.willpower || 1,

				edge: attributes?.edge || 1,
				essence: attributes?.essence || 6,
				magic: attributes?.magic || 0,
				resonance: attributes?.resonance || 0,
			},
		},
	});
};

export type PlayerCharacterForm = ReturnType<typeof useCharacterForm>;
