import type { MetatypeKey } from "#/lib/system/types/MetatypeData.ts";
import type { AttributeKey } from "./attributeKey.ts";
import type { AwakeningType } from "./awakeningType.ts";
import type { GearData } from "./gear/gearData.ts";
import type { AdeptPowerData } from "./magic/adeptPowerData.ts";
import type { SpellData } from "./magic/spellData.ts";
import type { QualityData } from "./qualityData.ts";
import type { SkillData } from "./skillData.ts";
import type { LifestyleType } from '#/lib/system/types/LifestyleType';

export interface PlayerCharacterData {
	id: string;
	version: number;

	profile: {
		alias: string;
		name: string;
		archetype?: string;

		streetCred: number;
		notoriety: number;

		description?: string;
		personality?: string;

		lifestyle?: {
			quality: LifestyleType;
			cost: number;
			monthsPaid: number;
		};
	};

	biology: {
		metatype: MetatypeKey;
		gender?: string;
		age?: number;
		weight?: string;
		height?: string;
		awakening: AwakeningType;
	};

	karma: {
		total: number;
		current: number;
	};

	nuyen: {
		current: number;
		loans: Array<{
			lender: string;
			amount: number;
			notes?: string;
		}>;
	};

	attributes: Record<AttributeKey, number>;

	edge: {
		current: number;
	};

	damage: {
		physical: {
			current: number;
			max: number;
		};

		stun: {
			current: number;
			max: number;
		};

		matrix: {
			current: number;
			max: number;
		};
	};

	gear: GearData[];
	skills: Record<string, SkillData>;
	qualities: QualityData[];

	spellcasting?: {
		knownSpells: SpellData[];
	};

	adept?: {
		powerPoints: {
			spent: number;
			max: number;
		};

		powers: AdeptPowerData[];
	};
}
