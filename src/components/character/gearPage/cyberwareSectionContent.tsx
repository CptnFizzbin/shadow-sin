import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { GearViewItem } from "#/components/character/gearPage/gearViewItem.tsx"
import { ImplantFormDialog } from "#/components/characterBuilder/sections/gear/cyberware/dialogs/implantFormDialog.tsx"
import { useGearStore } from "#/components/gear/useGearApi.ts"
import type { ImplantData } from "#/lib/system/gear/implantData.ts"
import { isImplant } from "#/lib/system/gear/implantData.ts"
import type { ItemData } from "#/lib/system/itemData.ts"

type CyberwareDialogState = null | { open: boolean }

interface CyberwareSectionContentProps {
  items: ItemData[]
  getChildren: (id: string) => ItemData[]
}

export const CyberwareSectionContent: FC<CyberwareSectionContentProps> = ({
  items,
  getChildren,
}) => {
  const gearStore = useGearStore()
  const [dialogState, setDialogState] = useState<CyberwareDialogState>(null)
  const implants = items.filter(isImplant)

  const closeDialog = () => setDialogState((prev) => prev && { ...prev, open: false })

  const handleSave = (implant: ImplantData) => {
    gearStore.save(implant)
    closeDialog()
  }

  return (
    <Stack gap={1}>
      {implants.map((item) => (
        <GearViewItem key={item.id} item={item} subItems={getChildren(item.id)} />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setDialogState({ open: true })}
        color="secondary"
        fullWidth
      >
        Add Implant
      </Button>

      {dialogState && (
        <ImplantFormDialog
          open={dialogState.open}
          onSave={handleSave}
          onClose={closeDialog}
          onClosed={() => setDialogState(null)}
        />
      )}
    </Stack>
  )
}
