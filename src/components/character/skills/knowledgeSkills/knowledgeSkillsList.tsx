import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiSearchLine } from "@remixicon/react"
import { sort } from "fast-sort"
import type { FC } from "react"
import { useState } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"

import { KnowledgeSkillsListItem } from "./knowledgeSkillsListItem.tsx"

export const KnowledgeSkillsList: FC = () => {
  const knowledgeSkills = useCharacterSheet((sheet) => sheet.skills.knowledgeSkills)
  const [searchQuery, setSearchQuery] = useState("")

  const visibleSkills = sort([...knowledgeSkills])
    .by([
      { desc: (s) => s.rating },
      { asc: (s) => s.name },
    ])
    .filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <TextField
        size="small"
        placeholder="Search knowledge skills…"
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
        <Label label="Knowledge Skills" />

        {visibleSkills.length === 0 && (
          <Typography

            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            {searchQuery ? "No knowledge skills found" : "No knowledge skills added"}
          </Typography>
        )}

        {visibleSkills.map((skill) => (
          <KnowledgeSkillsListItem
            key={skill.name}
            skill={skill}
          />
        ))}
      </Stack>
    </>
  )
}
