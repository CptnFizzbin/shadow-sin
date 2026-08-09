import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiAddLine } from "@remixicon/react"
import { useNavigate } from "@tanstack/react-router"
import type { FC } from "react"

import { useSinFormDialog } from "#/components/items/types/licenses/dialogs/sinFormDialog.tsx"
import { SinDataCard } from "#/components/items/types/licenses/sinDataCard.tsx"
import { isNewItem } from "#/lib/stores/runner/gear/gearSlice.actions.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { ItemType } from "#/system/itemType.ts"

export const LicensesSectionContent: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const navigate = useNavigate({ from: "/$runnerId" })
  const sins = useRunnerStoreSelector(Selectors.gear.selectGearOfType(ItemType.sin))
  const sinFormDialog = useSinFormDialog()

  const saveItem = (item: SinData) =>
    dispatch(isNewItem(item) ? Actions.gear.addItem(item) : Actions.gear.setItem(item))

  const handleEditSin = async (sin?: SinData) => {
    const saved = await sinFormDialog.open({ sin })
    if (saved) saveItem(saved)
  }

  return (
    <Stack>
      {Object.values(sins).map((sin) => (
        <SinDataCard
          key={sin.id}
          sin={sin}
          onOpen={() => navigate({ to: "/$runnerId/item/$itemId", params: { itemId: sin.id } })}
          onEdit={() => handleEditSin(sin)}
        />
      ))}

      <Button
        variant="outlined"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => handleEditSin()}
        color="secondary"
        fullWidth
      >
        Add SIN
      </Button>

      {sinFormDialog.dialog}
    </Stack>
  )
}
