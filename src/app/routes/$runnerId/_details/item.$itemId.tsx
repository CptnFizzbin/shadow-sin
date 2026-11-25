import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowLeftLine } from "@remixicon/react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { AnyItemDetails } from "#/app/components/entities/items/details/anyItemDetails.tsx"
import type { UUID } from "#/common/uuid/uuidUtils.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

export const Route = createFileRoute("/$runnerId/_details/item/$itemId")({
  component: ItemDetailsRoute,
})

/**
 * One shared route for every item type (mirrors the `AnyItemCard` dispatcher):
 * items are stored flat (`RunnerData.gear`), not partitioned by section, so
 * there's no per-section detail route to duplicate the dispatch logic in.
 * Renders full-screen via the `_details` layout — a drill-down page isn't a
 * peer tab (ADR-0009).
 */
function ItemDetailsRoute() {
  const { itemId } = Route.useParams()
  const navigate = Route.useNavigate()
  const router = useRouter()
  const dispatch = useRunnerStoreDispatch()
  const item = useRunnerSelector(ItemSelectors.selectById, { itemId: itemId as UUID })

  const handleBack = () => router.history.back()

  // Selling or deleting the Item from its actions dialog leaves nothing to show, so return to
  // wherever the Player came from.
  const [hadItem, setHadItem] = useState(!!item)
  if (item && !hadItem) setHadItem(true)
  useEffect(() => {
    if (hadItem && !item) router.history.back()
  }, [hadItem, item, router])

  return (
    <Stack sx={{ gap: 0 }}>
      <Stack sx={{ padding: 2 }}>
        <Button
          onClick={handleBack}
          sx={{ alignSelf: "flex-start" }}
          startIcon={<RiArrowLeftLine size={20} />}
          variant="contained"
        >
          Back
        </Button>

        {/* TODO: add breadcrumbs */}
      </Stack>

      {!itemId && (
        <Typography color="text.secondary">This item no longer exists.</Typography>
      )}

      {item && (
        <AnyItemDetails
          item={item}
          onRemove={() => {
            dispatch(Actions.item.removeItem({ id: item.id }))
            handleBack()
          }}
          onRemoved={handleBack}
          onOpenAttachment={(attachment) =>
            navigate({ to: "/$runnerId/item/$itemId", params: { itemId: attachment.id } })}
        />
      )}
    </Stack>
  )
}
