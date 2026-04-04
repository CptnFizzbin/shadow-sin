import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiSearchLine } from "@remixicon/react"
import { sort } from "fast-sort"
import type { FC } from "react"
import { useMemo, useState } from "react"

import { ActiveSkillsListItem } from "#/components/Skills/active-skills/active-skills-list-item.tsx"
import { useSkillsStore } from "#/components/Skills/use-skills-store.ts"
import { Label } from "#/components/UI/text/label.tsx"
import { SkillKey, skills } from "#/lib/system/skill-key.ts"

export const ActiveSkillsList: FC = () => {
  const skillsStore = useSkillsStore()

  const [searchQuery, setSearchQuery] = useState("")

  const skillEntries = useMemo(() => {
    return Object.values(SkillKey)
      .map((skillKey) => {
        const skillInfo = skills[skillKey]
        const skillRating = skillsStore.activeSkills.getSkillValue(skillKey)
        const skillSpecialization = skillsStore.activeSkills.getSpecialization(skillKey)
        return { key: skillKey, ...skillInfo, rating: skillRating, specialization: skillSpecialization }
      }).filter((skillInfo) => {
        return skillInfo.rating >= 0 || !!skillInfo.defaultable
      })
  }, [skillsStore])

  const visibleSkills = sort(skillEntries)
    .by([
      { desc: (skill) => skill.rating >= 1 },
      { asc: (skill) => skill.key },
    ])
    .filter((skill) => {
      const searchSpace = [skill.key, skill.group, skill.specialization ?? ""].join("|").toLowerCase()
      return searchSpace.includes(searchQuery.toLowerCase())
    })

  const groupedSkills = Object.groupBy(visibleSkills, (s) => s.rating >= 1 ? "Skilled" : "Defaulted")

  return (
    <>
      <TextField
        size="small"
        placeholder="Search skills…"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <RiSearchLine size={16} />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
      />

      <Stack>
        {visibleSkills.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            No skills found
          </Typography>
        )}

        {Object.entries(groupedSkills).map(([group, groupSkills]) => (
          <>
            <Label label={group} />
            {groupSkills.map((skill) => (
              <ActiveSkillsListItem
                key={skill.key}
                skillKey={skill.key}
                rating={skill.rating}
              />
            ))}
          </>
        ))}
      </Stack>
    </>
  )
}
