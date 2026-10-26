import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import { RiArrowRightSLine } from "@remixicon/react"
import type { FC } from "react"

import { HouseRulesSelectors } from "#/state/runner/houseRules/houseRules.selector.ts"
import { KarmaSelectors } from "#/state/runner/karma/karma.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { MANAGE_KARMA_OPTIONS } from "./manageKarmaOptions.ts"
import type { ManageKarmaStep } from "./manageKarmaWorkflow.ts"
import { createManageKarmaData, useManageKarmaWorkflow } from "./manageKarmaWorkflow.ts"

/** Menu step of the Manage Karma dialog: one row per karma workflow. */
export const ManageKarmaMenu: FC = () => {
  const workflow = useManageKarmaWorkflow()
  const karma = useRunnerSelector(KarmaSelectors.select)
  const isNuyenExchangeEnabled = useRunnerSelector(HouseRulesSelectors.select, { key: "karma.nuyenExchange" })
  const visibleOptions = MANAGE_KARMA_OPTIONS.filter(
    (option) => isNuyenExchangeEnabled || !option.requiresNuyenExchange,
  )

  const handleSelect = (step: ManageKarmaStep) => {
    // Each visit starts clean rather than keeping values typed into an abandoned step.
    workflow.setData(createManageKarmaData(karma))
    workflow.next(step)
  }

  return (
    <Paper>
      <List disablePadding>
        {visibleOptions.map(({ step, label, description, Icon }, index) => (
          <ListItem
            key={step}
            disablePadding
            divider={index < visibleOptions.length - 1}
            secondaryAction={(
              <RiArrowRightSLine size={18} style={{ color: "var(--mui-palette-text-secondary)" }} />
            )}
          >
            <ListItemButton onClick={() => handleSelect(step)} sx={{ minHeight: 56 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Icon size={20} />
              </ListItemIcon>
              <ListItemText primary={label} secondary={description} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
