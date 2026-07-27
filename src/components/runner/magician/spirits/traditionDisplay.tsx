import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"
import type { SpiritType } from "#/system/magic/spiritData.ts"
import { SpiritTypeLabels } from "#/system/magic/spiritData.ts"

export const TraditionDisplay: FC = () => {
  const tradition = useRunnerStoreSelector((s) => s.tradition)

  if (!tradition) {
    return (
      <Paper sx={{ p: 2, textAlign: "center", borderStyle: "dashed" }}>
        <Typography color="text.secondary">No Tradition Defined</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{
      p: { xs: 1.5, sm: 2 },
      background: "linear-gradient(135deg, var(--mui-palette-background-paper) 0%, var(--mui-palette-background-default) 100%)",
    }}
    >
      <Stack sx={{ gap: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{ justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}
        >
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: "bold" }}>
              Tradition
            </Typography>
            <Typography>
              {tradition.name}
            </Typography>
            {tradition.concept && (
              <Typography variant="body2" color="text.secondary">
                {tradition.concept}
              </Typography>
            )}
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Drain Attribute
            </Typography>
            <Typography>
              {AttributeLabels[tradition.drainAttribute]}
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            Spirit Associations
          </Typography>
          <Box sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(5, 1fr)" },
            gap: 1,
          }}
          >
            {(Object.entries(tradition.spiritTypes) as [string, SpiritType][]).map(([category, type]) => (
              <Box
                key={category}
                sx={{
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textTransform: "capitalize" }}
                >
                  {category}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {SpiritTypeLabels[type]}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Stack>
    </Paper>
  )
}
