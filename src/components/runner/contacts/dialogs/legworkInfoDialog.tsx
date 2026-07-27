import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { createDicePool } from "#/components/system/dicePool/dicePoolData.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { DetailDialog } from "#/components/ui/dialog/detailDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup } from "#/lib/hooks/system/dicePool/useDiceGroup.ts"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { ContactData } from "#/system/contactData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

const hitLevels: [string, string][] = [
  ["0 hits", "Nothing relevant"],
  ["1", "Common knowledge"],
  ["2", "Specific public knowledge"],
  ["3", "Some non-public information"],
  ["4", "Specific non-public information"],
  ["5+", "Exact details"],
]

interface LegworkInfoDialogProps extends ControlledDialogProps<void> {
  contact: ContactData
}

const LegworkInfoDialog: FC<LegworkInfoDialogProps> = ({ ctrl, contact }) => {
  const gmPool = createDicePool("legwork.gm", "Contact Knowledge Test", [
    { name: "Connection", size: contact.connection },
    { name: "Connection", size: contact.connection },
  ])

  const playerPool = createDicePool("legwork.player", "Legwork Test", [
    useAttrDiceGroup(AttributeKey.charisma),
    useActiveSkillDiceGroup(SkillKey.etiquette),
    { name: "Loyalty", size: contact.loyalty },
  ])

  return (
    <DetailDialog ctrl={ctrl} title={`Legwork: ${contact.name}`}>
      <Stack sx={{ gap: 1.5 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Label label="GM" variant="outlined" />
          <DicePool name={gmPool.name} groups={gmPool.groups} />
          <Typography color="text.secondary">
            Each hit is how much the contact knows.
          </Typography>
        </Stack>

        <Stack sx={{ gap: 0.5 }}>
          <Label label="Player" variant="outlined" />
          <DicePool name={playerPool.name} groups={playerPool.groups} />
          <Typography color="text.secondary">
            Each hit is how much the contact will offer for free.
          </Typography>
        </Stack>

        <Stack sx={{ gap: 0.5 }}>
          <Label label="Hits" variant="outlined" />
          <Table size="small">
            <TableBody>
              {hitLevels.map(([hits, description]) => (
                <TableRow key={hits}>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{hits}</TableCell>
                  <TableCell>{description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Stack>
      </Stack>
    </DetailDialog>
  )
}

interface UseLegworkInfoDialogProps {
  contact: ContactData
}

export const useLegworkInfoDialog = () => useDialog<void, UseLegworkInfoDialogProps>(
  (ctrl, props) => <LegworkInfoDialog ctrl={ctrl} contact={props.contact} />,
)
