import type { CSSObject } from "@mui/material"
import type { SxProps, Theme } from "@mui/material/styles"

export function mergeSx<TTheme extends object>(
  ...sxList: (false | SxProps<TTheme> | undefined)[]
): SxProps<TTheme> {
  return sxList
    .filter((sx): sx is SxProps => Boolean(sx))
    .flatMap((sx) => (Array.isArray(sx) ? sx : [sx]))
}

export function withTheme(styles: {
  base?: (theme: Theme) => CSSObject
  dark?: (theme: Theme) => CSSObject
  light?: (theme: Theme) => CSSObject
}): SxProps<Theme> {
  return (theme) => {
    let resolved: CSSObject = {}

    if (styles.base) {
      resolved = { ...resolved, ...styles.base(theme) }
    }

    if (styles?.light) {
      resolved = { ...resolved, ...theme.applyStyles("light", styles.light(theme)) }
    }

    if (styles?.dark) {
      resolved = { ...resolved, ...theme.applyStyles("dark", styles.dark(theme)) }
    }

    return resolved
  }
}
