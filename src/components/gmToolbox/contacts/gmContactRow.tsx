import Checkbox from "@mui/material/Checkbox"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { ContactRow } from "#/components/runner/sections/contacts/viewer/contactsListItem.tsx"
import type { ContactData } from "#/system/model/contacts/contactData.ts"

interface GmContactRowProps {
  contact: ContactData
  selected: boolean
  onToggleSelected: () => void
  onEdit: () => void
  onRemove: () => void
}

export const GmContactRow: FC<GmContactRowProps> = ({
  contact,
  selected,
  onToggleSelected,
  onEdit,
  onRemove,
}) => (
  <Stack direction="row" sx={{ alignItems: "center", gap: 0 }}>
    <Checkbox
      checked={selected}
      onChange={onToggleSelected}
      slotProps={{ input: { "aria-label": `Select ${contact.name}` } }}
    />
    <Stack sx={{ flexGrow: 1 }}>
      <ContactRow contact={contact} onClick={onEdit} onRemove={onRemove} />
    </Stack>
  </Stack>
)
