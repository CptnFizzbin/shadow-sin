import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiArrowLeftLine } from "@remixicon/react"
import { createFileRoute, useRouter } from "@tanstack/react-router"

import { ItemDetails } from "#/components/items/details/itemDetails.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"

export const Route = createFileRoute("/$runnerId/_details/item/$itemId")({
  component: ItemDetailsRoute,
})

/**
 * One shared route for every item type (mirrors the `ItemDataCard` dispatcher):
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
  const item = useRunnerStoreSelector(Selectors.gear.selectById(itemId as UUID))

  const handleBack = () => router.history.back()

  return (
    <Stack sx={{ gap: 2 }}>
      <IconButton onClick={handleBack} aria-label="Back" sx={{ alignSelf: "flex-start" }}>
        <RiArrowLeftLine size={20} />
      </IconButton>

      {item
        ? (
            <ItemDetails
              item={item}
              onRemove={() => {
                dispatch(Actions.gear.removeItem({ id: item.id }))
                handleBack()
              }}
              onRemoved={handleBack}
              onOpenAttachment={(attachment) =>
                navigate({ to: "/$runnerId/item/$itemId", params: { itemId: attachment.id } })}
            />
          )
        : <Typography color="text.secondary">This item no longer exists.</Typography>}
    </Stack>
  )
}
