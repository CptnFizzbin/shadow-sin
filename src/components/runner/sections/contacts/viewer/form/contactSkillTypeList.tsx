import Button from "@mui/material/Button"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import type { ContactSkillData } from "#/system/model/contacts/contactSkillData.ts"
import { ContactSkillType } from "#/system/model/contacts/contactSkillData.ts"

export const contactSkillTypeLabels: Record<ContactSkillType, string> = {
  [ContactSkillType.keyActive]: "Key Active Skills",
  [ContactSkillType.knowledge]: "Knowledge Skills",
}

const addSkillLabels: Record<ContactSkillType, string> = {
  [ContactSkillType.keyActive]: "Add Key Active Skill",
  [ContactSkillType.knowledge]: "Add Knowledge Skill",
}

interface ContactSkillTypeListProps {
  /** Every skill on the contact; only those of `type` are shown. */
  skills: ContactSkillData[]
  type: ContactSkillType
  /** Receives the contact's full skill list after an edit. */
  onChange: (skills: ContactSkillData[]) => void
}

/** Edits the contact's skills of one type, leaving skills of other types in place. */
export const ContactSkillTypeList: FC<ContactSkillTypeListProps> = ({
  skills,
  type,
  onChange,
}) => {
  const replaceSkill = (index: number, skill: ContactSkillData) =>
    onChange(skills.map((existing, existingIndex) => existingIndex === index ? skill : existing))

  const removeSkill = (index: number) =>
    onChange(skills.filter((_, existingIndex) => existingIndex !== index))

  const entries = skills
    .map((skill, index) => ({ skill, index }))
    .filter(({ skill }) => skill.type === type)

  return (
    <Stack>
      {entries.length === 0 && (
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          None
        </Typography>
      )}

      {entries.map(({ skill, index }) => (
        <Stack component={Paper} key={index} direction="row" sx={{ padding: 1 }}>
          <Stack direction={{ xs: "column", sm: "row" }} sx={{ flexGrow: 1 }}>
            <TextField
              label="Skill"
              size="small"
              fullWidth
              value={skill.name}
              onChange={(e) => replaceSkill(index, { ...skill, name: e.target.value })}
            />
            <TextField
              label="Specialization (optional)"
              size="small"
              fullWidth
              value={skill.specialization ?? ""}
              onChange={(e) => replaceSkill(index, { ...skill, specialization: e.target.value })}
            />
          </Stack>

          <IconButton
            size="small"
            color="error"
            aria-label="Remove skill"
            onClick={() => removeSkill(index)}
          >
            <RiDeleteBin6Line size={16} />
          </IconButton>
        </Stack>
      ))}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine />}
        onClick={() => onChange([...skills, { name: "", type }])}
      >
        {addSkillLabels[type]}
      </Button>
    </Stack>
  )
}
