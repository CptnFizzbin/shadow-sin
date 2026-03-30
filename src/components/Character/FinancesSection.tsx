import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterStore } from "#/components/Character/CharacterSheetProvider.tsx"
import { Nuyen } from "#/components/UI/Nuyen.tsx"

export const FinancesSection: FC = () => {
  const nuyen = useCharacterStore((s) => s.nuyen)
  const karma = useCharacterStore((s) => s.karma)

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
