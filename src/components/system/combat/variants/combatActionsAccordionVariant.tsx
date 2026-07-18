import Accordion from "@mui/material/Accordion"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowDownSLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import type { CombatActionCategory } from "#/components/system/combat/combatActionData.ts"
import { combatActionCategories, combatActions } from "#/components/system/combat/combatActionData.ts"

export const CombatActionsAccordionVariant: FC = () => {
  const [expanded, setExpanded] = useState<CombatActionCategory | false>(combatActionCategories[0].category)

  return (
    <Stack sx={{ gap: 1 }}>
      {combatActionCategories.map((categoryInfo) => {
        const actions = combatActions.filter((action) => action.category === categoryInfo.category)

        return (
          <Accordion
            key={categoryInfo.category}
            disableGutters
            elevation={0}
            expanded={expanded === categoryInfo.category}
            onChange={(_, isExpanded) => setExpanded(isExpanded ? categoryInfo.category : false)}
            sx={{ border: "1px solid", borderColor: "divider" }}
          >
            <AccordionSummary expandIcon={<RiArrowDownSLine />}>
              <Stack direction="row" sx={{ gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: "bold" }}>{categoryInfo.label}</Typography>
                <Chip size="small" color={categoryInfo.color} label={categoryInfo.costHint} />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Stack sx={{ gap: 1.5 }} divider={<Divider />}>
                {actions.map((action) => (
                  <Stack key={action.name} sx={{ gap: 0.25 }}>
                    <Typography variant="subtitle2">{action.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{action.description}</Typography>
                  </Stack>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )
      })}
    </Stack>
  )
}
