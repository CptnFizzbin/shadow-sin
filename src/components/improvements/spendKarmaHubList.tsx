import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import { RiArrowRightSLine } from "@remixicon/react"
import type { FC } from "react"

import { KarmaChip } from "#/components/runner/karma/karmaChip.tsx"
import { useSectionQueuedSummaries } from "#/hooks/improvements/useSectionQueuedSummaries.ts"
import { selectVisibleSections } from "#/hooks/improvements/useVisibleSections.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import type { SpendKarmaSectionKey } from "./spendKarmaSections.tsx"

interface SpendKarmaHubListProps {
  onSelectSection: (section: SpendKarmaSectionKey) => void
}

/**
 * Landing view of the Spend Karma dialog: one row per improvement category.
 * Rows with queued improvements show a count and their total karma cost.
 */
export const SpendKarmaHubList: FC<SpendKarmaHubListProps> = ({ onSelectSection }) => {
  const visibleSections = useRunnerSelector(selectVisibleSections)
  const sectionSummaries = useSectionQueuedSummaries()

  return (
    <Paper>
      <List disablePadding>
        {visibleSections.map(({ key, label, Icon }, index) => {
          const queued = sectionSummaries[key]
          return (
            <ListItem
              key={key}
              disablePadding
              divider={index < visibleSections.length - 1}
              secondaryAction={(
                <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
                  {queued.count > 0 && <KarmaChip amount={queued.cost} color="success" />}
                  <RiArrowRightSLine
                    size={18}
                    style={{ color: "var(--mui-palette-text-secondary)" }}
                  />
                </Stack>
              )}
            >
              <ListItemButton onClick={() => onSelectSection(key)} sx={{ minHeight: 56 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  secondary={queued.count > 0
                    ? `${queued.count} queued`
                    : undefined}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}
