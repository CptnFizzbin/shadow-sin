import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { Nuyen } from "#/components/ui/nuyen.tsx"
import { SectionHeader } from "#/components/ui/text/sectionHeader.tsx"

export const FinancesSection: FC = () => {
  const nuyen = useCharacterSheet((s) => s.nuyen)
  const karma = useCharacterSheet((s) => s.karma)

  return (
    <Box>
      <SectionHeader>Finances & Karma</SectionHeader>
      <Typography>
        Nuyen: {nuyen ? <Nuyen amount={nuyen.current} /> : "—"}
      </Typography>
      <Typography>
        Karma: {karma ? karma.current : "—"} / {karma ? karma.total : "—"}
      </Typography>
    </Box>
  )
}
