import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"
import type { FC } from "react"

import type { EditorTabId } from "./editorTabId.ts"
import { editorTabOrder, getEditorTabLabel } from "./editorTabId.ts"

interface EditorTabsProps {
  value: EditorTabId
  onChange: (value: EditorTabId) => void
}

export const EditorTabs: FC<EditorTabsProps> = ({ value, onChange }) => {
  return (
    <Tabs
      value={value}
      onChange={(_, next: EditorTabId) => onChange(next)}
      variant="scrollable"
      allowScrollButtonsMobile
      scrollButtons="auto"
      sx={{ flex: 1, minWidth: 0 }}
    >
      {editorTabOrder.map((id) => (
        <Tab key={id} label={getEditorTabLabel(id)} value={id} />
      ))}
    </Tabs>
  )
}
