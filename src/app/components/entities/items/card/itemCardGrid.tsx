import Box from "@mui/material/Box"
import type { FC, PropsWithChildren } from "react"

/** Lays Item cards out one per row on narrow screens and in columns on wide ones. */
export const ItemCardGrid: FC<PropsWithChildren> = ({ children }) => (
  <Box
    sx={{
      display: "grid",
      gap: 1,
      gridTemplateColumns: {
        xs: "minmax(0, 1fr)",
        md: "repeat(2, minmax(0, 1fr))",
        xl: "repeat(3, minmax(0, 1fr))",
      },
      alignItems: "start",
    }}
  >
    {children}
  </Box>
)
