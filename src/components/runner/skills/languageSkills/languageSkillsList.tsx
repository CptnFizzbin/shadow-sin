import InputAdornment from "@mui/material/InputAdornment"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiSearchLine } from "@remixicon/react"
import { sort } from "fast-sort"
import type { FC } from "react"
import { useState } from "react"

import { useRunnerData } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"

import { LanguageSkillListItem } from "./languageSkillsListItem.tsx"

export const LanguageSkillsList: FC = () => {
  const languageSkills = useRunnerData((sheet) => sheet.skills.languageSkills)
  const [searchQuery, setSearchQuery] = useState("")

  const visibleSkills = sort(languageSkills)
    .by([
      { desc: (s) => s.rating === "native" },
      { asc: (s) => s.name },
    ])
    .filter((skill) => skill.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <TextField
        size="small"
        placeholder="Search languages…"
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
        <Label label="Languages" />

        {visibleSkills.length === 0 && (
          <Typography

            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            {searchQuery ? "No languages found" : "No language skills added"}
          </Typography>
        )}

        {visibleSkills.map((skill) => (
          <LanguageSkillListItem
            key={skill.name}
            skill={skill}
          />
        ))}
      </Stack>
    </>
  )
}
