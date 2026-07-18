import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import type { FC } from "react"
import { useState } from "react"

import type { CombatActionData } from "#/components/system/combat/combatActionData.ts"
import { combatActionCategories, combatActions } from "#/components/system/combat/combatActionData.ts"
import { filterBySearch, SearchField } from "#/components/ui/search/searchField.tsx"

const categoryInfoByCategory = Object.fromEntries(
  combatActionCategories.map((info) => [info.category, info]),
)

const getSearchTexts = (action: CombatActionData) => [action.name, action.description, action.category]

export const CombatActionsTableVariant: FC = () => {
  const [search, setSearch] = useState("")
  const searchTerms = search.trim().split(/\s+/).filter(Boolean)

  const rows = searchTerms.length === 0
    ? combatActions
    : combatActions.filter(filterBySearch(getSearchTexts, searchTerms))

  return (
    <Stack sx={{ gap: 1 }}>
      <SearchField value={search} onChange={setSearch} placeholder="Search actions..." />

      {rows.length === 0
        ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
              No actions match "{search}".
            </Typography>
          )
        : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>What it does</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((action) => {
                  const categoryInfo = categoryInfoByCategory[action.category]

                  return (
                    <TableRow key={action.name}>
                      <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}>{action.name}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Chip size="small" color={categoryInfo.color} label={categoryInfo.label} />
                      </TableCell>
                      <TableCell>{action.description}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
    </Stack>
  )
}
