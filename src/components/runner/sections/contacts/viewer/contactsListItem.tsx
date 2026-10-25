import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiSearchLine } from "@remixicon/react"
import type { FC } from "react"

import type { ContactData } from "#/system/model/contacts/contactData.ts"
import type { ContactSkillData } from "#/system/model/contacts/contactSkillData.ts"
import { ContactSkillType } from "#/system/model/contacts/contactSkillData.ts"

const skillChipLabel = (skill: ContactSkillData) =>
  skill.specialization ? `${skill.name} (${skill.specialization})` : skill.name

interface ContactRowProps {
  contact: ContactData
  onClick: () => void
  onLegwork?: () => void
  onRemove?: () => void
}

export const ContactRow: FC<ContactRowProps> = ({
  contact,
  onClick,
  onLegwork,
  onRemove,
}) => {
  const namedSkills = (contact.skills ?? []).filter((skill) => skill.name)
  const skills = [
    ...namedSkills.filter((skill) => skill.type === ContactSkillType.keyActive),
    ...namedSkills.filter((skill) => skill.type !== ContactSkillType.keyActive),
  ]

  return (
    <Stack
      direction="row"
      onClick={onClick}
      sx={{
        "alignItems": "center", "gap": 1, "padding": 1,
        "borderRadius": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack sx={{ gap: 0.5, flexGrow: 1 }}>
        <Stack direction="row">
          <Typography sx={{ flexGrow: 1 }}>{contact.name}</Typography>

          {onLegwork && (
            <IconButton
              size="small"
              color="secondary"
              aria-label="Legwork"
              onClick={(e) => {
                e.stopPropagation()
                onLegwork()
              }}
            >
              <RiSearchLine size={16} />
            </IconButton>
          )}

          {onRemove && (
            <IconButton
              size="small"
              color="error"
              aria-label="Remove"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
            >
              <RiDeleteBin6Line size={16} />
            </IconButton>
          )}
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

        {contact.notes && (
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
            {contact.notes}
          </Typography>
        )}

        {skills.length > 0 && (
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
            {skills.map((skill) => (
              <Chip
                key={skill.id}
                label={skillChipLabel(skill)}
                size="small"
                color="secondary"
                // Filled chips mark Key Active skills apart from Knowledge skills at a glance.
                variant={skill.type === ContactSkillType.keyActive ? "filled" : "outlined"}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
