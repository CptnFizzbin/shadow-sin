import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { RiCloseLine } from "@remixicon/react"
import type { FC } from "react"

import type { EditorTabId } from "./editorTabId.ts"
import { editorTabOrder, getEditorTabLabel } from "./editorTabId.ts"

interface EditorNavDrawerProps {
  open: boolean
  onClose: () => void
  value: EditorTabId
  onSelect: (value: EditorTabId) => void
}

export const EditorNavDrawer: FC<EditorNavDrawerProps> = ({ open, onClose, value, onSelect }) => {
  const handleSelect = (id: EditorTabId) => {
    onSelect(id)
    onClose()
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
    >
      <Toolbar sx={{ justifyContent: "space-between", paddingX: 1 }}>
        <Typography variant="h2">Go to page</Typography>
        <IconButton onClick={onClose} aria-label="Close menu">
          <RiCloseLine />
        </IconButton>
      </Toolbar>

      <List disablePadding>
        {editorTabOrder.map((id) => (
          <ListItem key={id} disablePadding>
            <ListItemButton
              selected={id === value}
              onClick={() => handleSelect(id)}
            >
              <ListItemText
                primary={getEditorTabLabel(id)}
                slotProps={{
                  primary: {
                    variant: "body1",
                    sx: { fontWeight: id === value ? "bold" : undefined },
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}
