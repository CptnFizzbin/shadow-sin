import MuiTextField from "@mui/material/TextField"
import type { FC } from "react"

export interface ProfileFieldsValue {
  alias: string
  name: string
  archetype: string
  description: string
  personality: string
}

interface ProfileFieldsProps {
  value: ProfileFieldsValue
  onChange: (field: keyof ProfileFieldsValue, value: string) => void
  /** Autofocus the Alias field on mount. Defaults to false. */
  autoFocus?: boolean
}

/** Shared Alias/Name/Archetype/Description/Personality fields, used by both the builder's live-bound profile section and the viewer's locally-buffered edit dialog. */
export const ProfileFields: FC<ProfileFieldsProps> = ({ value, onChange, autoFocus = false }) => (
  <>
    <MuiTextField
      label="Alias"
      fullWidth
      variant="outlined"
      size="small"
      autoFocus={autoFocus}
      value={value.alias}
      onChange={(e) => onChange("alias", e.target.value)}
    />

    <MuiTextField
      label="Name"
      fullWidth
      variant="outlined"
      size="small"
      value={value.name}
      onChange={(e) => onChange("name", e.target.value)}
    />

    <MuiTextField
      label="Archetype"
      fullWidth
      variant="outlined"
      size="small"
      value={value.archetype}
      onChange={(e) => onChange("archetype", e.target.value)}
    />

    <MuiTextField
      label="Description"
      fullWidth
      multiline
      rows={3}
      variant="outlined"
      size="small"
      value={value.description}
      onChange={(e) => onChange("description", e.target.value)}
    />

    <MuiTextField
      label="Personality"
      fullWidth
      multiline
      rows={3}
      variant="outlined"
      size="small"
      value={value.personality}
      onChange={(e) => onChange("personality", e.target.value)}
    />
  </>
)
