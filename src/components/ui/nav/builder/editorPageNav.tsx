import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react"
import type { FC } from "react"

import type { EditorTabId } from "./editorTabId.ts"
import { isFinalizeTab } from "./editorTabId.ts"

interface EditorPageNavProps {
  value: EditorTabId
  isFirst: boolean
  isLast: boolean
  onPrev: () => void
  onNext: () => void
  onFinalize: () => void
}

export const EditorPageNav: FC<EditorPageNavProps> = ({
  value,
  isFirst,
  isLast,
  onPrev,
  onNext,
  onFinalize,
}) => {
  return (
    <Stack direction="row">
      <Button
        variant="outlined"
        size="small"
        startIcon={<RiArrowLeftLine size={16} />}
        onClick={onPrev}
        disabled={isFirst}
      >
        Prev
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        size="small"
        onClick={onFinalize}
        disabled={isFinalizeTab(value)}
        sx={{ flexGrow: 1 }}
      >
        Finalize
      </Button>
      <Button
        variant="outlined"
        size="small"
        endIcon={<RiArrowRightLine size={16} />}
        onClick={onNext}
        disabled={isLast}
      >
        Next
      </Button>
    </Stack>
  )
}
