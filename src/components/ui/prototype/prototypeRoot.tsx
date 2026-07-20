// fallow-ignore-file
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { Children, isValidElement, useMemo, useState } from "react"

import { PrototypeSelectionContext } from "./prototypeContext.ts"
import type { PrototypeItemProps } from "./prototypeItem.tsx"
import { PrototypeItem } from "./prototypeItem.tsx"

/** Walks the tree (through any wrapping elements) collecting `Prototype.Item` names in first-seen order. */
function collectNames(node: ReactNode, names: string[] = []): string[] {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return

    if (child.type === PrototypeItem) {
      const { name, children } = child.props as PrototypeItemProps
      if (!names.includes(name)) names.push(name)
      collectNames(children, names)
      return
    }

    const { children } = child.props as { children?: ReactNode }
    if (children !== undefined) collectNames(children, names)
  })

  return names
}

export interface PrototypeRootProps {
  children: ReactNode
}

export const PrototypeRoot: FC<PrototypeRootProps> = ({ children }) => {
  const names = useMemo(() => collectNames(children), [children])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const activeIndex = names.length === 0 ? 0 : Math.min(selectedIndex, names.length - 1)
  const selectedName = names[activeIndex] ?? null

  const goToPrevious = () => setSelectedIndex((activeIndex - 1 + names.length) % names.length)
  const goToNext = () => setSelectedIndex((activeIndex + 1) % names.length)

  return (
    <PrototypeSelectionContext.Provider value={selectedName}>
      <Box sx={{ border: "1px solid", borderColor: "divider" }}>
        {children}
      </Box>

      <Paper
        elevation={4}
        square
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 0.5,
          padding: 1,
          zIndex: (theme) => theme.zIndex.tooltip,
        }}
      >
        <IconButton onClick={goToPrevious} aria-label="Previous prototype" size="small">
          <RiArrowLeftSLine />
        </IconButton>
        <Typography variant="body2" sx={{ px: 1, whiteSpace: "nowrap" }}>
          {names.length === 0 ? "0 / 0" : `${activeIndex + 1} / ${names.length} — ${selectedName}`}
        </Typography>
        <IconButton onClick={goToNext} aria-label="Next prototype" size="small">
          <RiArrowRightSLine />
        </IconButton>
      </Paper>
    </PrototypeSelectionContext.Provider>
  )
}

PrototypeRoot.displayName = "Prototype"
