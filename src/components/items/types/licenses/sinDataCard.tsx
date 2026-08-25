import type { FC } from "react"

import { ItemCard } from "#/components/itemCard/itemCard.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
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
    dispatch(Actions.item.removeItem({ id: sin.id, removeChildren: true }))
  }

  return (
    <>
      <ItemCard item={sin} onOpen={onOpen} onEdit={onEdit} onRemove={removeSin}>
        {hasLicenses && (
          <ItemCard.Layout.BodyRow
            direction="column"
            sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
          >
            {Object.values(licenses).map((license) => (
              <ItemCard.Subitem
                key={license.id}
                name={license.name}
                stats={[{ label: "Rating", value: license.rating ?? "unknown" }]}
              />
            ))}
          </ItemCard.Layout.BodyRow>
        )}
      </ItemCard>

      {confirmDialog.outlet}
    </>
  )
}
