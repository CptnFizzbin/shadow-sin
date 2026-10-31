import type { TypographyProps } from "@mui/material/Typography"
import Typography from "@mui/material/Typography"
import type { SxProps, Theme } from "@mui/material/styles"
import type { FC } from "react"
import type { Components } from "react-markdown"
import Markdown from "react-markdown"
import remarkBreaks from "remark-breaks"

import { mergeSx } from "#/integrations/mui/muiUtils.ts"

import { MarkdownHeading } from "./markdownHeading.tsx"
import { remarkDisableIndentedCode } from "./remarkDisableIndentedCode.ts"

const markdownSx: SxProps<Theme> = {
  "& > :first-child": { marginTop: 0 },
  "& > :last-child": { marginBottom: 0 },
  "& p, & ul, & ol, & blockquote": { marginBlock: 1 },
  "& ul, & ol": { paddingLeft: 3 },
}

const markdownPlugins = [remarkBreaks, remarkDisableIndentedCode]

const markdownComponents: Components = {
  h1: MarkdownHeading,
  h2: MarkdownHeading,
  h3: MarkdownHeading,
  h4: MarkdownHeading,
  h5: MarkdownHeading,
  h6: MarkdownHeading,
}

interface MarkdownTextProps extends Omit<TypographyProps<"div">, "children" | "component"> {
  children: string
}

/**
 * Renders user-entered free text (such as a description) as Markdown. Headings render as bold text, single newlines
 * are kept as line breaks, leading indentation does not start a code block, and raw HTML is not rendered.
 *
 * ```tsx
 * <MarkdownText color="text.secondary">{item.description}</MarkdownText>
 * ```
 */
export const MarkdownText: FC<MarkdownTextProps> = ({ children, sx, ...props }) => (
  <Typography
    component="div"
    sx={mergeSx(markdownSx, sx)}
    {...props}
  >
    <Markdown remarkPlugins={markdownPlugins} components={markdownComponents}>
      {children}
    </Markdown>
  </Typography>
)
