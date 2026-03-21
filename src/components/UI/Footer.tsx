import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 2, py: 1 }}>
      <Typography
        variant="caption"
        component="div"
        sx={{ fontSize: "8pt", opacity: 0.5 }}
      >
        ShadowSIN is an independent fan project and is not affiliated with,
        endorsed by, or connected to Catalyst Game Labs. Shadowrun and all
        related content are trademarks and/or copyrights of Catalyst Game Labs.
        All rights reserved.
      </Typography>
    </Box>
  )
}
