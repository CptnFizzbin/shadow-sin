import MenuItem from "@mui/material/MenuItem"
import type { SelectChangeEvent } from "@mui/material/Select"
import Select from "@mui/material/Select"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import type { FC } from "react"
import { useCallback } from "react"

import { characterSections } from "#/components/Character/characterSections.ts"
import { Route as CharacterIndexRoute } from "#/routes/$characterId/index.tsx"

export const CharacterNavBar: FC = () => {
  const navigate = useNavigate({ from: CharacterIndexRoute.fullPath })
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const pathSegments = pathname.split("/").filter(Boolean)
  const currentSegment = pathSegments[pathSegments.length - 1] ?? "about"
  const isKnownSection = characterSections.some((section) => section.to === currentSegment)
  const currentSection = isKnownSection ? currentSegment : "about"

  const handleChange = useCallback(
    (event: SelectChangeEvent) => {
      void navigate({ to: event.target.value })
    },
    [navigate],
  )

  return (
    <nav aria-label="Character sections">
      <Select
        value={currentSection}
        onChange={handleChange}
        variant="standard"
        disableUnderline
        inputProps={{ "aria-label": "Navigate to section" }}
        sx={{
          "color": "inherit",
          "& .MuiSelect-icon": { color: "inherit" },
        }}
      >
        {characterSections.map((section) => (
          <MenuItem key={section.to} value={section.to}>
            {section.label}
          </MenuItem>
        ))}
      </Select>
    </nav>
  )
}
