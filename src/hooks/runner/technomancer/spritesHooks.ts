import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useMaxSpriteTasks = () => {
  return useActiveSkill(SkillKey.compiling)
}
