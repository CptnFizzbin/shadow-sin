import Typography from "@mui/material/Typography"
import type { FC, PropsWithChildren } from "react"

/** A Markdown heading rendered as a bold paragraph, so headings in free-text fields don't outsize their container. */
export const MarkdownHeading: FC<PropsWithChildren> = ({ children }) => (
  <Typography component="p" variant="inherit" sx={{ fontWeight: "bold" }}>
    {children}
  </Typography>
)
