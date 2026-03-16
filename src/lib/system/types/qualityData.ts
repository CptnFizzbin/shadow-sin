import type { GearEffectData } from "#/lib/system/types/gearEffectData.ts";
import type { SourceData } from "#/lib/system/types/sourceData.ts";

export interface QualityData {
	name: string;
	cost?: number;
	description: string;
	source?: SourceData;
	effects?: GearEffectData[];
	incompatableWith?: string[];
}
