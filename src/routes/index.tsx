import { createFileRoute } from '@tanstack/react-router'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <Box component="main" sx={{ maxWidth: 'lg', mx: 'auto', px: 2, py: 4 }}>
      <Paper sx={{ p: { xs: 3, sm: 5 }, mb: 4, borderRadius: 3 }}>
        <Typography variant="overline" color="primary" display="block" gutterBottom>
          TanStack Router Base Template
        </Typography>
        <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ maxWidth: 600 }}>
          Start simple, ship quickly.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 560 }}>
          This base starter intentionally keeps things light: two routes, clean structure, and
          the essentials you need to build from scratch.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" href="/about">
            About This Starter
          </Button>
          <Button
            variant="text"
            href="https://tanstack.com/router"
            target="_blank"
            rel="noopener noreferrer"
          >
            Router Guide
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          [
            'Type-Safe Routing',
            'Routes and links stay in sync across every page.',
          ],
          [
            'React Query',
            'Manage server state with powerful caching and sync.',
          ],
          [
            'MUI Components',
            'Build quickly with Material Design v7 components.',
          ],
          [
            'TanStack Store',
            'Lightweight reactive state management.',
          ],
        ].map(([title, desc]) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={title}>
            <Paper sx={{ p: 2.5, height: '100%', borderRadius: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                gutterBottom
              >
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {desc}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography
          variant="overline"
          color="primary"
          display="block"
          gutterBottom
        >
          Quick Start
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
          {[
            <>Edit <code>src/routes/index.tsx</code> to customize the home page.</>,
            <>Update <code>src/components/Header.tsx</code> and <code>src/components/Footer.tsx</code> for brand links.</>,
            <>Add routes in <code>src/routes</code>.</>,
          ].map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            <Typography
              key={i}
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      </Paper>
    </Box>
  )
}
