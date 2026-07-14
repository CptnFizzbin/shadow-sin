// fallow-ignore-file
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import type { FC, ReactElement, ReactNode } from "react"
import { Children, isValidElement, useState } from "react"

import type { PrototypeItemProps } from "./prototypeItem.tsx"
import { PrototypeItem } from "./prototypeItem.tsx"

function isPrototypeItem(item: ReactNode): item is ReactElement<PrototypeItemProps> {
  return isValidElement(item) && item.type === PrototypeItem
}

export interface PrototypeRootProps {
  children: ReactNode
}

export const PrototypeRoot: FC<PrototypeRootProps> = ({ children }) => {
  const items = Children.toArray(children).filter(isPrototypeItem)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const activeIndex = items.length === 0 ? 0 : Math.min(selectedIndex, items.length - 1)
  const selected = items[activeIndex]

  const goToPrevious = () => setSelectedIndex((activeIndex - 1 + items.length) % items.length)
  const goToNext = () => setSelectedIndex((activeIndex + 1) % items.length)

  return (
    <>
      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {selected}
      </Box>

      <Paper
        elevation={4}
        sx={{
          position: "fixed",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          padding: 0.5,
          borderRadius: 999,
          zIndex: (theme) => theme.zIndex.tooltip,
        }}
      >
        <IconButton onClick={goToPrevious} aria-label="Previous prototype" size="small">
          <RiArrowLeftSLine />
        </IconButton>
        <Typography variant="body2" sx={{ px: 1, whiteSpace: "nowrap" }}>
          {activeIndex + 1} / {items.length} — {selected?.props.title}
        </Typography>
        <IconButton onClick={goToNext} aria-label="Next prototype" size="small">
          <RiArrowRightSLine />
        </IconButton>
      </Paper>
    </>
  )
}

PrototypeRoot.displayName = "Prototype"
