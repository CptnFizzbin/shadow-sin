import { useAppForm } from "#/integrations/tanstack-form/UseAppForm.ts";
import { AwakeningType } from "#/lib/system/types/awakeningType.ts";
import { LifestyleType } from "#/lib/system/types/LifestyleType.ts";
import { MetatypeKey } from "#/lib/system/types/MetatypeData.ts";
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts";

export interface CharacterFormState {
	buildPoints: {
		total: number;
		spent: {
			metatype: number;
			qualities: number;
			attributes: number;
			skills: number;
			gear: number;
		};
	};

	name: string;
	alias: string;
	lifestyle: LifestyleType;
	age: number;
	metatype: MetatypeKey;
	awakening: AwakeningType;

	attributes: {
		body: number;
		agility: number;
		reaction: number;
		strength: number;
		charisma: number;
		intuition: number;
		logic: number;
		willpower: number;
		edge: number;
		essence: number;
		magic: number;
		resonance: number;
	};
}

export const useCharacterForm = (character?: PlayerCharacterData) => {
	const { profile, biology, attributes } = character || {};

	const defaultValues: CharacterFormState = {
		buildPoints: {
			total: 400,
			spent: {
				metatype: 0,
				qualities: 0,
				attributes: 0,
				skills: 0,
				gear: 0,
			},
		},

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
	};

	return useAppForm({ defaultValues });
};

export type PlayerCharacterForm = ReturnType<typeof useCharacterForm>;
