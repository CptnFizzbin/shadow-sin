import type { FC } from "react";
import { useAttribute, useSkill } from "#/components/Character/UseAttribute.ts";
import { DicePool } from "#/components/DicePool/DicePool.tsx";
import { SkillKey } from "#/lib/system/types/SkillKey.ts";

// NOTE: wound modifiers are not applied to these dice pools.

export const RangedDefenseDicePool = () => {
	return (
		<DicePool
			name={"Ranged Defense"}
			groups={[{ name: "Reaction", size: useAttribute("reaction") }]}
		/>
	);
};

export const RangedFullDefenseDicePool = () => {
	return (
		<DicePool
			name={"Ranged Full Defense"}
			groups={[
				{ name: "Reaction", size: useAttribute("reaction") },
				{ name: "Dodge", size: useSkill(SkillKey.dodge) },
			]}
		/>
	);
};

export const MeleeParryDicePool: FC<{ weaponSkill: SkillKey }> = ({
	weaponSkill,
}) => {
	return (
		<DicePool
			name={`${weaponSkill} Parry`}
			groups={[
				{ name: "Reaction", size: useAttribute("reaction") },
				{ name: weaponSkill, size: useSkill(weaponSkill) },
			]}
		/>
	);
};

export const MeleeBlockDicePool = () => {
	return (
		<DicePool
			name={"Melee Block"}
			groups={[
				{ name: "Reaction", size: useAttribute("reaction") },
				{ name: "Unarmed Combat", size: useSkill(SkillKey.unarmedCombat) },
			]}
		/>
	);
};

export const MeleeDodgeDicePool = () => {
	return (
		<DicePool
			name={"Melee Dodge"}
			groups={[
				{ name: "Reaction", size: useAttribute("reaction") },
				{ name: "Dodge", size: useSkill(SkillKey.dodge) },
			]}
		/>
	);
};

export const MeleeFullParryDicePool: FC<{ weaponSkill: SkillKey }> = ({
	weaponSkill,
}) => {
	return (
		<DicePool
			name={`${weaponSkill} Full Parry`}
			groups={[
				{ name: "Reaction", size: useAttribute("reaction") },
				{ name: weaponSkill, size: useSkill(weaponSkill) },
				{ name: "Dodge", size: useSkill(SkillKey.dodge) },
			]}
		/>
	);
};

export const MeleeFullBlockDicePool = () => {
	return (
		<DicePool
			name={"Melee Full Block"}
			groups={[
				{ name: "Reaction", size: useAttribute("reaction") },
				{ name: "Unarmed Combat", size: useSkill(SkillKey.unarmedCombat) },
				{ name: "Dodge", size: useSkill(SkillKey.dodge) },
			]}
		/>
	);
};

export const MeleeFullDodgeDicePool = () => {
	return (
		<DicePool
			name={"Melee Full Dodge"}
			groups={[
				{ name: "Reaction", size: useAttribute("reaction") },
				{ name: "Dodge", size: useSkill(SkillKey.dodge) },
				{ name: "Dodge", size: useSkill(SkillKey.dodge) },
			]}
		/>
	);
};

export const PhysicalSpellDefenseDicePool = () => {
	return (
		<DicePool
			name={"Physical Spell Defense"}
			groups={[
				{ name: "Body", size: useAttribute("body") },
				{ name: "Counterspelling", size: useSkill(SkillKey.counterspelling) },
			]}
		/>
	);
};

export const ManaSpellDefenseDicePool = () => {
	return (
		<DicePool
			name={"Mana Spell Defense"}
			groups={[
				{ name: "Willpower", size: useAttribute("willpower") },
				{ name: "Counterspelling", size: useSkill(SkillKey.counterspelling) },
			]}
		/>
	);
};
