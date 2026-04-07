import type { UUID } from "node:crypto"

import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Stack from "@mui/material/Stack"
import type { FC } from "react"
import { useRef } from "react"

import { ImplantFormFields } from "#/components/characterBuilder/sections/gear/cyberware/forms/implantFormFields.tsx"
import {
  implantFieldMap,
  useImplantForm,
} from "#/components/characterBuilder/sections/gear/cyberware/forms/useImplantForm.tsx"
import { GearAcquireActions } from "#/components/gear/gearAcquireActions.tsx"
import {
  ImplantGradeNuyenMultiplier,
} from "#/components/gear/implantUtils.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { ImplantGrade } from "#/lib/system/gear/implantData.ts"

interface CyberwareFormDialogProps {
  open: boolean
  implant?: ImplantData
  parentId?: UUID
  onClose: () => void
  onClosed?: () => void
  onSave?: (implant: ImplantData) => void
  onAcquire?: (implant: ImplantData) => void
  onPurchase?: (implant: ImplantData) => void
}

export const ImplantFormDialog: FC<CyberwareFormDialogProps> = ({
  open,
  implant,
  parentId,
  onClose,
  onClosed,
  onSave,
  onAcquire,
  onPurchase,
}) => {
  const editMode = !!implant
  const title = editMode ? `Edit Implant` : `Add Implant`
  const submitModeRef = useRef<"acquire" | "purchase" | "save">("save")

  const form = useImplantForm({
    implant,
    parentId,
    onSubmit: (submittedImplant) => {
      if (onAcquire && onPurchase) {
        if (submitModeRef.current === "purchase") {
          onPurchase(submittedImplant)
        } else {
          onAcquire(submittedImplant)
        }
      } else {
        onSave?.(submittedImplant)
      }
    },
  })

  const useAcquireMode = !!onAcquire && !!onPurchase

  return (
    <Dialog open={open} fullWidth onTransitionExited={onClosed}>
      <DialogTitle sx={{ padding: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ padding: 1 }}>
        <Stack gap={1} sx={{ padding: 1 }}>
          <ImplantFormFields form={form} fields={implantFieldMap} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ padding: 1 }}>
        {useAcquireMode
          ? (
              <form.Subscribe selector={(state) => ({ cost: state.values.cost, grade: state.values.grade })}>
                {({ cost, grade }) => {
                  const multiplier =
                    ImplantGradeNuyenMultiplier[grade as ImplantGrade]
                    ?? ImplantGradeNuyenMultiplier[ImplantGrade.standard]
                  const effectiveCost = (cost ?? 0) * multiplier
                  return (
                    <GearAcquireActions
                      cost={effectiveCost}
                      onClose={onClose}
                      onAcquire={() => {
                        submitModeRef.current = "acquire"
                        form.handleSubmit()
                      }}
                      onPurchase={() => {
                        submitModeRef.current = "purchase"
                        form.handleSubmit()
                      }}
                    />
                  )
                }}
              </form.Subscribe>
            )
          : (
              <>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  type="submit"
                  onClick={() => {
                    submitModeRef.current = "save"
                    form.handleSubmit()
                  }}
                  variant="contained"
                >
                  Save
                </Button>
              </>
            )}
      </DialogActions>
    </Dialog>
  )
}
