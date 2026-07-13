import Box from "@mui/material/Box"
import InputAdornment from "@mui/material/InputAdornment"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiSearchLine } from "@remixicon/react"
import type { Key, ReactNode } from "react"
import { Fragment } from "react"

import { Label } from "#/components/ui/text/label.tsx"

interface SkillListPanelProps<T> {
  searchPlaceholder: string
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  headerControls?: ReactNode
  groups: [string, T[]][]
  getKey: (skill: T) => Key
  renderItem: (skill: T) => ReactNode
  emptyMessage: string
}

export function SkillListPanel<T>({
  searchPlaceholder,
  searchQuery,
  onSearchQueryChange,
  headerControls,
  groups,
  getKey,
  renderItem,
  emptyMessage,
}: SkillListPanelProps<T>) {
  const isEmpty = groups.every(([, skills]) => skills.length === 0)

  return (
    <>
      <TextField
        size="small"
        placeholder={searchPlaceholder}
        value={searchQuery}
        onChange={(event) => onSearchQueryChange(event.target.value)}
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

      {headerControls}

      <Box>
        {isEmpty && (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", py: 2 }}
          >
            {emptyMessage}
          </Typography>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            columnGap: 2,
            rowGap: 1,
          }}
        >
          {groups.map(([group, skills]) => (
            <Fragment key={group}>
              <Label label={group} sx={{ gridColumn: "1 / -1" }} />
              {skills.map((skill) => (
                <Fragment key={getKey(skill)}>{renderItem(skill)}</Fragment>
              ))}
            </Fragment>
          ))}
        </Box>
      </Box>
    </>
  )
}
