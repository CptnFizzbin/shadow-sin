import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import {
  getComplexFormBp,
} from "#/components/characterBuilder/sections/resources/technomancer/complexForms/complexFormsUtils.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import type { ComplexFormData } from "#/system/magic/complexFormData.ts"

interface ComplexFormRowProps {
  form: ComplexFormData
  onEdit: () => void
  onDelete: () => void
}

export const ComplexFormsListItem: FC<ComplexFormRowProps> = ({
  form,
  onEdit,
  onDelete,
}) => {
  return (
    <Box
      sx={{
        "p": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
        <Typography sx={{ flexGrow: 1 }}>
          {form.name}
        </Typography>

        <Chip
          label={form.rating}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem", minWidth: 28 }}
        />

        <BuildPoints
          value={getComplexFormBp(form)}
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
