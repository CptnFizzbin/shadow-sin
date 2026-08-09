import type { RemixiconComponentType } from "@remixicon/react"
import {
  RiAddLine,
  RiArchive2Line,
  RiCheckboxCircleFill,
  RiDragMoveLine,
  RiForbidLine,
  RiLoopLeftFill,
  RiLoopLeftLine,
  RiPushpinFill,
  RiSignalWifiLine,
  RiSignalWifiOffLine,
  RiSwordLine,
} from "@remixicon/react"

/**
 * Shape every icon in `Icons` must satisfy, regardless of source library.
 * RemixIcon is the current source; swapping in FontAwesome or a custom icon
 * for one entry only requires that icon to accept a `size` prop.
 */
export type IconComponent = RemixiconComponentType

export const Icons = {
  item: {
    attack: RiSwordLine,
    equipped: RiCheckboxCircleFill,
    stashed: RiArchive2Line,
    fixed: RiPushpinFill,
    wireless: {
      enabled: RiSignalWifiLine,
      disabled: RiSignalWifiOffLine,
      removed: RiForbidLine,
    },
    add: RiAddLine,
    move: RiDragMoveLine,
  },
  spell: {
    sustained: RiLoopLeftFill,
    notSustained: RiLoopLeftLine,
  },
}
