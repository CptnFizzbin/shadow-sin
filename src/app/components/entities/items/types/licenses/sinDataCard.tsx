import type { FC } from "react"

import { ItemAttachmentTree } from "#/app/components/entities/items/card/itemAttachmentTree.tsx"
import { ItemCard } from "#/app/components/ui/cards/itemCard/itemCard.tsx"
import type { SinData } from "#/data/items/sinData.ts"
import { useConfirmDialog } from "#/forms/dialog/confirmDialog.tsx"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

interface SinDataCardProps {
  sin: SinData
  onOpen?: () => void
  onEdit?: () => void
}

export const SinDataCard: FC<SinDataCardProps> = ({ sin, onOpen, onEdit }) => {
  const dispatch = useRunnerStoreDispatch()
  const confirmDialog = useConfirmDialog()
  const licenses = useRunnerSelector(ItemSelectors.selectChildrenOf, { itemId: sin.id })
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
      <ItemCard
        item={sin}
        onOpen={onOpen}
        onEdit={onEdit}
        onRemove={removeSin}
      >
        {hasLicenses && (
          <ItemCard.Layout.BodyRow
            direction="column"
            sx={{ gap: 0.25, paddingLeft: 1, borderLeft: "2px solid", borderColor: "secondary.dark" }}
          >
            <ItemAttachmentTree itemId={sin.id} />
          </ItemCard.Layout.BodyRow>
        )}
      </ItemCard>

      {confirmDialog.outlet}
    </>
  )
}
