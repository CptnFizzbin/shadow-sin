import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import type { FC } from "react"
import { useState } from "react"

import { CounterInput } from "#/components/ui/counter/counterInput.tsx"
import type { ControlledDialogProps } from "#/components/ui/dialog/controlledDialogProps.ts"
import { ControlledDialog, Dialog } from "#/components/ui/dialog/dialog.tsx"
import { useDialog } from "#/lib/hooks/ui/dialog/useDialog.tsx"
import type { KnowledgeSkillData } from "#/system/skills/knowledgeSkillData"
import { SkillRatingMax } from "#/system/skills/skillUtils.ts"

interface KnowledgeSkillEditDialogProps extends ControlledDialogProps<KnowledgeSkillData> {
  skill?: KnowledgeSkillData
  onDelete?: () => void
}

const KnowledgeSkillEditDialog: FC<KnowledgeSkillEditDialogProps> = ({
  ctrl,
  skill,
  onDelete,
}) => {
  const isEditMode = !!skill

  const [name, setName] = useState<string>(skill?.name ?? "")
  const [rating, setRating] = useState<number>(skill?.rating ?? 1)
  const [specialization, setSpecialization] = useState<string>(
    skill?.specialization ?? "",
  )
  const [nameError, setNameError] = useState(false)

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    ctrl.close({
      name: name.trim(),
      rating,
      specialization: specialization.trim() || undefined,
    })
  }

  const handleClosed = () => {
    setName(skill?.name ?? "")
    setRating(skill?.rating ?? 1)
    setSpecialization(skill?.specialization ?? "")
    setNameError(false)
  }

  return (
    <ControlledDialog ctrl={ctrl} maxWidth="sm" onClose={false} onClosed={handleClosed}>
      <Dialog.Title>
        {isEditMode ? "Edit Knowledge Skill" : "Add Knowledge Skill"}
      </Dialog.Title>

      <Dialog.Content>
        <Stack sx={{ gap: 2, pt: 1 }}>
          <TextField
            label="Skill Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(false)
            }}
            error={nameError}
            helperText={nameError ? "Name is required" : ""}
            size="small"
            fullWidth
            autoFocus
          />

          <CounterInput
            label="Rating"
            size="small"
            fullWidth
            min={1}
            max={SkillRatingMax}
            value={rating}
            onChange={(newValue) => setRating(newValue ?? 1)}
          />

          <TextField
            label="Specialization (optional)"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            size="small"
            fullWidth
            helperText="Costs 1 SP"
          />
        </Stack>
      </Dialog.Content>

      <Dialog.Actions>
        <Stack direction="row" sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box>
            {onDelete && (
              <Button
                color="error"
                onClick={() => {
                  onDelete()
                  ctrl.close()
                }}
              >
                Delete
              </Button>
            )}
          </Box>
          <Box>
            <Button color="secondary" onClick={() => ctrl.close()}>
              Cancel
            </Button>
            <Button variant="contained" color="secondary" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Stack>
      </Dialog.Actions>
    </ControlledDialog>
  )
}

type UseKnowledgeSkillDialogProps = Omit<
  KnowledgeSkillEditDialogProps,
  keyof ControlledDialogProps<KnowledgeSkillData>
>

export const useKnowledgeSkillDialog = () => useDialog<KnowledgeSkillData, UseKnowledgeSkillDialogProps | undefined>(
  (ctrl, props) => <KnowledgeSkillEditDialog ctrl={ctrl} {...props} />,
)
