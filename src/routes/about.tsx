import { createFileRoute } from '@tanstack/react-router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <Box component="main" sx={{ maxWidth: 'lg', mx: 'auto', px: 2, py: 4 }}>
      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        <Typography variant="overline" color="primary" display="block" gutterBottom>
          About
        </Typography>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          A small starter with room to grow.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, lineHeight: 2 }}>
          TanStack Router gives you type-safe routing and a great developer experience. Use this
          as a clean foundation, then layer in your own routes, components, and add-ons.
        </Typography>
      </Paper>
    </Box>
  )
}
