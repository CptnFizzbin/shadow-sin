import {
  RiAddLine,
  RiArchive2Line,
  RiCheckboxCircleFill,
  RiDeleteBinLine,
  RiDragMoveLine,
  RiEditLine,
  RiForbidLine,
  RiLoopLeftFill,
  RiLoopLeftLine,
  RiPushpinFill,
  RiSignalWifiLine,
  RiSignalWifiOffLine,
  RiSwordLine,
} from "@remixicon/react"
import type { ComponentClass, FC } from "react"

/**
 * Shape every icon in `Icons` must satisfy, regardless of source library.
 * RemixIcon is the current source; swapping in FontAwesome or a custom icon
 * for one entry only requires that icon to accept a `size` prop.
 */
export type IconComponent =
  | FC<{ size?: number | string }>
  | ComponentClass<{ size?: number | string }>

export const Icons = {
  Edit: RiEditLine,
  Delete: RiDeleteBinLine,

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
