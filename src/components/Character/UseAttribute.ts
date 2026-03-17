import { useCharacterStore } from "#/components/Character/CharacterStoreProvider.tsx";
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts";
import { type SkillKey, Skills } from "#/lib/system/types/SkillKey.ts";

export const useAttribute = (attribute: AttributeKey) => {
  return useCharacterStore((state) => {
    return state.attributes[attribute];
  });
};

export const useSkill = (skill: SkillKey) => {
  const attr = Skills[skill].attr;
  const skillRating = useCharacterStore((state) => {
    return state.skills[skill]?.rating || 0;
  });

  const attribute = useAttribute(attr);
  return skillRating + attribute;
};
