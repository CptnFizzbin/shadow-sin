import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { QuickAttributesSection } from "#/components/character/quickPanel/quickAttributesSection.tsx"
import { QuickDamageSection } from "#/components/character/quickPanel/quickDamageSection.tsx"
import { QuickEdgeSection } from "#/components/character/quickPanel/quickEdgeSection.tsx"

export const QUICK_ACCESS_PANEL_HEIGHT = "56px"

export const QuickAccessPanel: FC = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={isExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
      sx={{
        "border": "1px solid",
        "borderColor": "divider",
        "& .MuiAccordionSummary-content": { margin: 0 },
      }}
    >
      <AccordionSummary
        expandIcon={<RiArrowDownSLine />}
        sx={{ padding: 1, margin: 0, minHeight: "unset" }}
      >
        <Typography variant="body2" color="text.secondary">
          Quick Access
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: 1 }}>
        <Stack gap={1.5} divider={<Divider />}>
          <QuickAttributesSection />
          <QuickDamageSection />
          <QuickEdgeSection />
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
