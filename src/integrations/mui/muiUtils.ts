import type { SxProps } from "@mui/material/styles"

export function mergeSx<Theme extends object>(
  ...sxList: (false | SxProps<Theme> | undefined)[]
): SxProps<Theme> {
  return sxList
    .filter((sx): sx is SxProps => Boolean(sx))
    .flatMap((sx) => (Array.isArray(sx) ? sx : [sx]))
}
