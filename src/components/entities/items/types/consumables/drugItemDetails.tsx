import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useItemActionsDialogContext } from "#/components/entities/items/actions/itemActionsDialogContext.ts"
import { ItemDetailsRoot } from "#/components/entities/items/details/itemDetailsRoot.tsx"
import { ItemDetailsSlot } from "#/components/entities/items/details/itemDetailsSlot.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { MarkdownText } from "#/components/ui/text/markdownText.tsx"
import { useConsumeAction } from "#/hooks/items/types/consumables/useConsumeAction.ts"
import { isNewItem } from "#/state/runner/items/items.actions.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import type { DrugData } from "#/system/model/items/consumableData.ts"
import { ConsumableTypeLabel } from "#/system/model/items/consumableData.ts"

import { useDrugFormDialog } from "./dialogs/drugFormDialog.tsx"

export interface DrugItemDetailsProps {
  drug: DrugData
  onRemoved?: () => void
}

/** Item details view for a Drug, with Consume (or End Effect, while it's Active) as a quick action. */
export const DrugItemDetails: FC<DrugItemDetailsProps> = ({ drug, onRemoved }) => {
  const dispatch = useRunnerStoreDispatch()
  const drugFormDialog = useDrugFormDialog()
  const consumeAction = useConsumeAction(drug)
  const itemActionsDialog = useItemActionsDialogContext()

  const removeDrug = () => {
    dispatch(Actions.item.removeItem({ id: drug.id, removeChildren: true }))
    onRemoved?.()
  }

  const handleEdit = async () => {
    const saved = await drugFormDialog.open({ drug })
    if (saved) dispatch(isNewItem(saved) ? Actions.item.addItem(saved) : Actions.item.setItem(saved))
  }

  const textFields = [
    { label: "Effects", text: drug.effectDescription },
    { label: "Crash", text: drug.crash },
  ].filter((field): field is { label: string, text: string } => !!field.text)

  return (
    <>
      <ItemDetailsRoot
        item={drug}
        type={ConsumableTypeLabel[drug.consumableType]}
        onEdit={handleEdit}
        onRemove={removeDrug}
      >
        {drug.duration ? <ItemDetailsSlot.Stat label="Duration" value={drug.duration} /> : null}

        {/* Without the actions dialog, the page already lists every state action — Consume included. */}
        {itemActionsDialog && consumeAction
          ? (
              <ItemDetailsSlot.QuickAction
                label={consumeAction.label}
                icon={<consumeAction.icon size={16} />}
                disabled={consumeAction.disabled}
                onClick={consumeAction.onClick}
              />
            )
          : null}

        {textFields.length > 0 && (
          <ItemDetailsSlot.Section>
            {textFields.map(({ label, text }) => (
              <Stack key={label} sx={{ gap: 0.5 }}>
                <Label>{label}</Label>
                <MarkdownText color="text.secondary">{text}</MarkdownText>
              </Stack>
            ))}
          </ItemDetailsSlot.Section>
        )}
      </ItemDetailsRoot>

      {drugFormDialog.outlet}
    </>
  )
}
