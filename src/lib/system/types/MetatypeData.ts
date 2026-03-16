import type { AttributeKey } from "#/lib/system/types/attributeKey.ts";
import type { GearEffectData } from "#/lib/system/types/gearEffectData.ts";

export enum MetatypeKey {
	Human = "Human",
	Ork = "Ork",
	Dwarf = "Dwarf",
	Elf = "Elf",
	Troll = "Troll",
}

export interface MetatypeData {
	name: string;
	cost: number;
	attributes: Record<
		AttributeKey,
		{ value: number; max: number; augMax?: number }
	>;
	inateAbilites?: GearEffectData[];
}

const commonAttributes = {
	essence: { value: 6, max: 6 },
	magic: { value: 0, max: 0 },
	resonance: { value: 0, max: 0 },
} as const;

export const metatypes: Record<MetatypeKey, MetatypeData> = {
	Human: {
		name: MetatypeKey.Human,
		cost: 0,
		attributes: {
			body: { value: 1, max: 6, augMax: 9 },
			agility: { value: 1, max: 6, augMax: 9 },
			reaction: { value: 1, max: 6, augMax: 9 },
			strength: { value: 1, max: 6, augMax: 9 },
			charisma: { value: 1, max: 6, augMax: 9 },
			intuition: { value: 1, max: 6, augMax: 9 },
			logic: { value: 1, max: 6, augMax: 9 },
			willpower: { value: 1, max: 6, augMax: 9 },
			edge: { value: 2, max: 7 },
			...commonAttributes,
		},
	},
	Ork: {
		name: MetatypeKey.Ork,
		cost: 20,
		attributes: {
			body: { value: 4, max: 9, augMax: 13 },
			agility: { value: 1, max: 6, augMax: 9 },
			reaction: { value: 1, max: 6, augMax: 9 },
			strength: { value: 3, max: 8, augMax: 12 },
			charisma: { value: 1, max: 5, augMax: 7 },
			intuition: { value: 1, max: 6, augMax: 9 },
			logic: { value: 1, max: 5, augMax: 7 },
			willpower: { value: 1, max: 6, augMax: 9 },
			edge: { value: 1, max: 6 },
			...commonAttributes,
		},
	},
	Dwarf: {
		name: MetatypeKey.Dwarf,
		cost: 25,
		attributes: {
			body: { value: 2, max: 7, augMax: 10 },
			agility: { value: 1, max: 6, augMax: 9 },
			reaction: { value: 1, max: 5, augMax: 7 },
			strength: { value: 3, max: 8, augMax: 12 },
			charisma: { value: 1, max: 5, augMax: 7 },
			intuition: { value: 1, max: 6, augMax: 9 },
			logic: { value: 1, max: 6, augMax: 9 },
			willpower: { value: 1, max: 7, augMax: 10 },
			edge: { value: 1, max: 6 },
			...commonAttributes,
		},
	},
	Elf: {
		name: MetatypeKey.Elf,
		cost: 30,
		attributes: {
			body: { value: 1, max: 6, augMax: 9 },
			agility: { value: 2, max: 7, augMax: 10 },
			reaction: { value: 1, max: 6, augMax: 9 },
			strength: { value: 1, max: 6, augMax: 9 },
			charisma: { value: 3, max: 8, augMax: 12 },
			intuition: { value: 1, max: 6, augMax: 9 },
			logic: { value: 1, max: 6, augMax: 9 },
			willpower: { value: 1, max: 6, augMax: 9 },
			edge: { value: 1, max: 6 },
			...commonAttributes,
		},
	},
	Troll: {
		name: MetatypeKey.Troll,
		cost: 40,
		attributes: {
			body: { value: 5, max: 10, augMax: 15 },
			agility: { value: 1, max: 5, augMax: 7 },
			reaction: { value: 1, max: 6, augMax: 9 },
			strength: { value: 5, max: 10, augMax: 15 },
			charisma: { value: 1, max: 4, augMax: 6 },
			intuition: { value: 1, max: 5, augMax: 7 },
			logic: { value: 1, max: 5, augMax: 7 },
			willpower: { value: 1, max: 6, augMax: 9 },
			edge: { value: 1, max: 6 },
			...commonAttributes,
		},
	},
};
