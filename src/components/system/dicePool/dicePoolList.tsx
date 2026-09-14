import Stack from "@mui/material/Stack"
import type { FC, PropsWithChildren } from "react"

export const DicePoolList: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap" }}>
      {children}
    </Stack>
  )
}
