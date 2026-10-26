import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { RiArrowLeftLine } from "@remixicon/react"
import type { FC, ReactNode } from "react"

interface ManageKarmaStepHeaderProps {
  title: ReactNode
  onBack: () => void
  /** Accessible name of the back button. */
  backLabel?: string
}

/** Title row for a Manage Karma step, with a back button to the previous step. Render it inside `Dialog.Title`. */
export const ManageKarmaStepHeader: FC<ManageKarmaStepHeaderProps> = ({
  title,
  onBack,
  backLabel = "Back to options",
}) => (
  <Stack direction="row" sx={{ alignItems: "center" }}>
    <IconButton aria-label={backLabel} onClick={onBack}>
      <RiArrowLeftLine size={20} />
    </IconButton>
    <Box sx={{ flex: 1 }}>{title}</Box>
    {/* Spacer mirrors the back button so the title stays centered. */}
    <Box sx={{ width: 36 }} />
  </Stack>
)
