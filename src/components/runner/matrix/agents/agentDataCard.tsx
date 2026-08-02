import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line, RiEdit2Line } from "@remixicon/react"
import type { FC } from "react"

import { DataCard } from "#/components/dataCard/dataCard.tsx"
import type { AgentData } from "#/system/matrix/agentData.ts"

interface AgentDataCardProps {
  agent: AgentData
  onEdit: () => void
  onRemove: () => void
}

export const AgentDataCard: FC<AgentDataCardProps> = ({ agent, onEdit, onRemove }) => {
  return (
    <DataCard>
      <DataCard.Title title={agent.name} />

      <DataCard.Stat value={`Rating ${agent.rating}`} />
      <DataCard.Stat value={`Pilot ${agent.rating}`} />

      <DataCard.Footer>
        <IconButton size="small" onClick={onEdit}>
          <RiEdit2Line size={16} />
        </IconButton>
        <IconButton size="small" color="error" onClick={onRemove}>
          <RiDeleteBin6Line size={16} />
        </IconButton>
      </DataCard.Footer>

      {agent.notes && (
        <DataCard.Content>
          <Stack sx={{ p: 1, gap: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                Notes
              </Typography>
              <Typography variant="body2">{agent.notes}</Typography>
            </Box>
          </Stack>
        </DataCard.Content>
      )}
    </DataCard>
  )
}
