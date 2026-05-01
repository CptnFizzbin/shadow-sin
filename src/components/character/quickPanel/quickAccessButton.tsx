import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { RiCloseLine, RiFlashlightLine } from "@remixicon/react"
import type { FC } from "react"
import { useEffect, useRef, useState } from "react"

import { NuyenSection } from "#/components/character/finances/nuyen/nuyenSection.tsx"

import { QuickAttributesSection } from "./quickAttributesSection.tsx"
import { QuickDamageSection } from "./quickDamageSection.tsx"
import { QuickEdgeSection } from "./quickEdgeSection.tsx"

export const QuickAccessButton: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const historyEntryPushed = useRef(false)

  useEffect(() => {
    const handlePopState = () => {
      if (historyEntryPushed.current) {
        historyEntryPushed.current = false
        setIsOpen(false)
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const openPanel = () => {
    if (historyEntryPushed.current) return
    window.history.pushState({ quickAccessPanel: true }, "")
    historyEntryPushed.current = true
    setIsOpen(true)
  }

  const closePanel = () => {
    setIsOpen(false)
    if (historyEntryPushed.current) {
      historyEntryPushed.current = false
      window.history.replaceState(null, "")
    }
  }

  return (
    <>
      <Button
        startIcon={<RiFlashlightLine size={18} />}
        onClick={openPanel}
      >
        Quick Access
      </Button>

      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={closePanel}
        slotProps={{ paper: { sx: { height: "100vh" } } }}
      >
        <Toolbar sx={{ justifyContent: "space-between", paddingX: 1, backgroundColor: "primary.main" }}>
          <Typography variant="h2">Quick Access</Typography>
          <IconButton onClick={closePanel} aria-label="Close quick access">
            <RiCloseLine />
          </IconButton>
        </Toolbar>

        <Container disableGutters>
          <Stack sx={{ padding: 1, overflowY: "auto" }}>
            <QuickAttributesSection />
            <QuickDamageSection />
            <QuickEdgeSection />
            <NuyenSection />
          </Stack>
        </Container>
      </Drawer>
    </>
  )
}
