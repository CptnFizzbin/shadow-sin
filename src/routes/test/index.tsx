import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemText from "@mui/material/ListItemText"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/test/")({
  component: TestIndexPage,
})

const testPages = [
  {
    label: "Typography",
    description: "Every Typography variant and color role, for checking the theme's type scale.",
    to: "/test/theme/typography",
  },
  {
    label: "ItemDetails — All Slots",
    description: "ItemDetailsRoot with every common field and every ItemDetailsSlot populated at once.",
    to: "/test/items/details/all",
  },
  {
    label: "EntityCard — All Elements",
    description: "EntityCard with every common EntityData field and every Layout region/element populated at once.",
    to: "/test/entityCard/all",
  },
] as const

/**
 * Index of design/visual-QA sandbox pages under `/test` — not part of the app's real navigation.
 * Add a new entry here whenever a new `/test/**` page is added, so it stays discoverable.
 */
function TestIndexPage() {
  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <Typography variant="h2">Design Test Pages</Typography>
      <Typography color="text.secondary">
        Sandbox pages for visually exercising in-progress or hard-to-reach component states. Not part of the app's
        real navigation.
      </Typography>

      <Paper>
        <List disablePadding>
          {testPages.map((page, index) => (
            <ListItem key={page.to} divider={index < testPages.length - 1} disablePadding>
              <ListItemButton component={Link} to={page.to}>
                <ListItemText
                  primary={<Typography variant="h3">{page.label}</Typography>}
                  secondary={<Typography color="text.secondary">{page.description}</Typography>}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  )
}
