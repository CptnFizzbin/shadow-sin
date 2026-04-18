import { Container } from "@mui/material"
import Button from "@mui/material/Button"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { RiCloseLine, RiFlashlightLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { QuickAttributesSection } from "#/components/character/quickPanel/quickAttributesSection.tsx"
import { QuickDamageSection } from "#/components/character/quickPanel/quickDamageSection.tsx"
import { QuickEdgeSection } from "#/components/character/quickPanel/quickEdgeSection.tsx"
import { NuyenSection } from "#/components/finances/nuyen/nuyenSection.tsx"

export const QuickAccessPanel: FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<RiFlashlightLine size={18} />}
        onClick={() => setIsOpen(true)}
        fullWidth
        sx={{ borderRadius: 2 }}
      >
        Quick Access
      </Button>

      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        slotProps={{ paper: { sx: { height: "100vh" } } }}
      >
        <Toolbar sx={{ justifyContent: "space-between", paddingX: 1, backgroundColor: "primary.main" }}>
          <Typography variant="h2">Quick Access</Typography>
          <IconButton onClick={() => setIsOpen(false)} aria-label="Close quick access">
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
