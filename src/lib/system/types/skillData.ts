import type { AttributeKey } from "#/lib/system/types/attributeKey.ts";

export type SkillCategory = "active" | "knowledge" | "language";

export interface SkillData {
	name: string;
	group?: string;
	category: SkillCategory;
	rating: number;

	linkedAttribute: AttributeKey;

	specialization?: string;

	notes?: string;

	source?: {
		book: string;
		page: number;
	};
}
