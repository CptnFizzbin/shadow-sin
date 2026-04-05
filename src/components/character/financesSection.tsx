import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"

export const FinancesSection: FC = () => {
  const nuyen = useCharacterSheet((s) => s.nuyen)
  const karma = useCharacterSheet((s) => s.karma)

  return (
    <Box>
      <Typography variant="subtitle2">Finances & Karma</Typography>
      <Typography variant="body2">
        Nuyen: {nuyen ? <Nuyen amount={nuyen.current} /> : "—"}
      </Typography>
      <Typography variant="body2">
        Karma: {karma ? karma.current : "—"} / {karma ? karma.total : "—"}
      </Typography>
    </Box>
  )
}
