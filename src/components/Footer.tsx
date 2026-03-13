import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{ mt: 'auto', py: 4, px: 2, borderTop: 1, borderColor: 'divider' }}
    >
      <Box
        sx={{
          maxWidth: 'lg',
          mx: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          &copy; {year} Your name here. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Built with TanStack Router
        </Typography>
      </Box>
    </Box>
  )
}
