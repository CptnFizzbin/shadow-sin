import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { getSpriteTasksBp } from "#/components/builder/sections/resources/technomancer/sprites/spritesUtils.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import type { SpriteData } from "#/system/magic/spriteData.ts"

interface SpriteRowProps {
  sprite: SpriteData
  resonanceValue: number
  onEdit: () => void
  onDelete: () => void
}

export const SpritesListItem: FC<SpriteRowProps> = ({
  sprite,
  resonanceValue,
  onEdit,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        "p": 1,
        "borderRadius": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <Stack sx={{ flexGrow: 1 }}>
          <Typography>{sprite.name}</Typography>
          <Typography color="text.secondary">
            Rating
            {" "}
            {resonanceValue}
            {" "}
            ·
            {" "}
            {sprite.services.max}
            {" "}
            task
            {sprite.services.max !== 1 ? "s" : ""}
          </Typography>
        </Stack>

        <Chip
          label={`R${resonanceValue}`}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem" }}
        />

        <BuildPoints
          value={getSpriteTasksBp(sprite)}

          sx={{ minWidth: 40, textAlign: "right" }}
        />

        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <RiDeleteBin6Line size={14} />
        </IconButton>
      </Stack>
    </Box>
  )
}
