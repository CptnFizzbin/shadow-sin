import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import type { FC } from "react"

import { ReputationStatType, ReputationStatTypeData } from "#/system/reputation/reputationLedgerEntry.ts"

export interface ReputationFilter {
  statTypes: ReputationStatType[]
}

interface ReputationLedgerFiltersProps {
  onChange: (filter: ReputationFilter) => void
  filters: ReputationFilter
}

export const ReputationLedgerFilters: FC<ReputationLedgerFiltersProps> = ({
  onChange,
  filters,
}) => {
  const handleChange = (value: (ReputationStatType | "ALL")[]) => {
    if (value.includes("ALL")) {
      onChange({ ...filters, statTypes: Object.values(ReputationStatType) })
    } else {
      onChange({ ...filters, statTypes: value as ReputationStatType[] })
    }
  }

  return (
    <ToggleButtonGroup
      value={filters.statTypes}
      onChange={(_event, statTypes) => handleChange(statTypes)}
      size="small"
      sx={{ flexWrap: "wrap" }}
    >
      <ToggleButton value="ALL">
        ALL
      </ToggleButton>
      {Object.entries(ReputationStatTypeData).map(([stat, { label }]) => (
        <ToggleButton key={stat} value={stat}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
