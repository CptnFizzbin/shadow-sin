import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_details/item/$itemid")({
  component: ItemDetailsPage,
})

function ItemDetailsPage() {
  const { itemid } = Route.useParams()

  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <Typography variant="h4">Item Details</Typography>
      <Typography color="text.secondary">Item {itemid}</Typography>
    </Stack>
  )
}
