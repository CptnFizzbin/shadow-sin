import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import type { ComplexFormFormState } from "#/components/CharacterBuilder/Sections/Resources/AwakenedFormState.ts"
import { getComplexFormBp } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexFormsUtils.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"

interface ComplexFormRowProps {
  form: ComplexFormFormState
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
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
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
