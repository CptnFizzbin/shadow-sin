import type { FC } from "react"

import { DataCardSlot } from "#/components/dataCard/dataCardSlot.tsx"
import { ItemDataCardRoot } from "#/components/itemCard/itemDataCardRoot.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SinData } from "#/system/gear/sinData.ts"

interface SinDataCardProps {
  sin: SinData
  onOpen?: () => void
  onEdit?: () => void
}

export const SinDataCard: FC<SinDataCardProps> = ({ sin, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
  const licenses = useRunnerStoreSelector(Selectors.gear.selectChildrenOf(sin.id))
  const hasLicenses = Object.keys(licenses).length > 0

  const removeSin = async () => {
    if (hasLicenses) {
      const confirmed = await confirmDialog.confirm({
        title: `Remove SIN "${sin.name}"?`,
        body: "This will also remove all associated licenses.",
        confirmLabel: "Remove SIN",
      })
      if (!confirmed) return
    }
    dispatch(Actions.gear.removeItem({ id: sin.id, removeChildren: true }))
  }

  return (
    <>
      <ItemDataCardRoot item={sin} onOpen={onOpen} onEdit={onEdit} onRemove={removeSin}>
        {Object.values(licenses).map((license) => (
          <DataCardSlot.Subitem
            key={license.id}
            name={license.name}
            stats={[
              { label: "Rating", value: license.rating ?? "unknown" },
            ]}
          />
        ))}
      </ItemDataCardRoot>

      {confirmDialog.dialog}
    </>
  )
}
