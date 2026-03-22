import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import type { ContactData } from "#/lib/system/types/contactData.ts"

interface ContactRowProps {
  contact: ContactData
  onClick: () => void
  onRemove: () => void
}

export const ContactRow: FC<ContactRowProps> = ({
  contact,
  onClick,
  onRemove,
}) => {
  const bpCost = contact.connection + contact.loyalty

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={1}
      sx={{
        padding: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onClick}
    >
      <Stack sx={{ flexGrow: 1 }} gap={0.5}>
        <Stack direction="row">
          <Typography flexGrow={1}>{contact.name}</Typography>

          <Typography color={"secondary.main"}>{bpCost} BP</Typography>

          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
          >
            <RiDeleteBin6Line size={16} />
          </IconButton>
        </Stack>
        <Stack direction="row">
          <Chip
            label={`Con: ${contact.connection}`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
          <Chip
            label={`Loy: ${contact.loyalty}`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.7rem" }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
