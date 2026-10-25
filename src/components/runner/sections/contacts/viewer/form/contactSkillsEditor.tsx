import Stack from "@mui/material/Stack"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import type { FC } from "react"
import { useState } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { ContactSkillData } from "#/system/model/contacts/contactSkillData.ts"
import { ContactSkillType } from "#/system/model/contacts/contactSkillData.ts"

import { ContactSkillTypeList, contactSkillTypeLabels } from "./contactSkillTypeList.tsx"

const skillTypes = [ContactSkillType.keyActive, ContactSkillType.knowledge]

interface ContactSkillsEditorProps {
  skills: ContactSkillData[]
  onChange: (skills: ContactSkillData[]) => void
}

/** Edits a contact's Key Active and Knowledge skills — stacked on wide viewports, tabbed on narrow ones. */
export const ContactSkillsEditor: FC<ContactSkillsEditorProps> = ({ skills, onChange }) => {
  const theme = useTheme()
  const isNarrowViewport = useMediaQuery(theme.breakpoints.down("sm"))
  const [activeType, setActiveType] = useState(ContactSkillType.keyActive)

  if (isNarrowViewport) {
    return (
      <Stack>
        <Tabs
          value={activeType}
          onChange={(_, type: ContactSkillType) => setActiveType(type)}
          variant="fullWidth"
        >
          {skillTypes.map((type) => (
            <Tab key={type} value={type} label={contactSkillTypeLabels[type]} />
          ))}
        </Tabs>
        <ContactSkillTypeList skills={skills} type={activeType} onChange={onChange} />
      </Stack>
    )
  }

  return (
    <>
      {skillTypes.map((type) => (
        <Stack key={type}>
          <Label label={contactSkillTypeLabels[type]} variant="outlined" />
          <ContactSkillTypeList skills={skills} type={type} onChange={onChange} />
        </Stack>
      ))}
    </>
  )
}
