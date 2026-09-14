// fallow-ignore-file
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"
import { useState } from "react"

import { PrototypeSelectionContext } from "./prototypeContext.ts"

export interface PrototypeVersion {
  /** Unique key. `Prototype.Item version="key"` matches against this. */
  key: string
  /** Display label shown in the switcher bar. */
  name: string
}

export interface PrototypeRootProps {
  /** The available versions, in switcher order. The first is selected by default. */
  versions: PrototypeVersion[]
  children: ReactNode
}

export const PrototypeRoot: FC<PrototypeRootProps> = ({ versions, children }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const activeIndex = versions.length === 0 ? 0 : Math.min(selectedIndex, versions.length - 1)
  const selected = versions[activeIndex] ?? null

  const goToPrevious = () => setSelectedIndex((activeIndex - 1 + versions.length) % versions.length)
  const goToNext = () => setSelectedIndex((activeIndex + 1) % versions.length)

  return (
    <PrototypeSelectionContext.Provider value={selected?.key ?? null}>
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
          {versions.length === 0 ? "0 / 0" : `${activeIndex + 1} / ${versions.length} — ${selected?.name}`}
        </Typography>
        <IconButton onClick={goToNext} aria-label="Next prototype" size="small">
          <RiArrowRightSLine />
        </IconButton>
      </Paper>
    </PrototypeSelectionContext.Provider>
  )
}

PrototypeRoot.displayName = "Prototype"
