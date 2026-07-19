import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableRow from "@mui/material/TableRow"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/components/ui/dialog/useDialog.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { ContactData } from "#/system/contactData.ts"

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
  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm">
      <Dialog.Title>{`Legwork: ${contact.name}`}</Dialog.Title>
      <Dialog.Content>
        <Stack sx={{ gap: 1.5 }}>
          <Stack sx={{ gap: 0.5 }}>
            <Label label="GM" variant="outlined" />
            <Typography>Contact Knowledge Test: Connection + Connection</Typography>
            <Typography color="text.secondary">
              Each hit is how much the contact knows.
            </Typography>
          </Stack>

          <Stack sx={{ gap: 0.5 }}>
            <Label label="Player" variant="outlined" />
            <Typography>Legwork Test: Charisma + Etiquette + Loyalty</Typography>
            <Typography color="text.secondary">
              Each hit is how much the contact will offer for free.
            </Typography>
          </Stack>

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
      </Dialog.Content>
      <Dialog.Actions>
        <Button onClick={() => ctrl.close()}>Close</Button>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

interface UseLegworkInfoDialogProps {
  contact: ContactData
}

export const useLegworkInfoDialog = () => useDialog<void, UseLegworkInfoDialogProps>(
  (ctrl, props) => <LegworkInfoDialog ctrl={ctrl} contact={props.contact} />,
)
