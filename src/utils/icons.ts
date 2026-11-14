import {
  RiAddLine,
  RiArchive2Line,
  RiCheckboxCircleFill,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiCpuLine,
  RiDeleteBinLine,
  RiDragMoveLine,
  RiEditLine,
  RiForbidLine,
  RiInboxArchiveLine,
  RiInboxUnarchiveLine,
  RiLoopLeftFill,
  RiLoopLeftLine,
  RiPlayLine,
  RiStopLine,
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
    implanted: RiCpuLine,
    stashed: RiArchive2Line,
    state: {
      equip: RiCheckboxCircleLine,
      unequip: RiCloseCircleLine,
      implant: RiCpuLine,
      extract: RiCloseCircleLine,
      stash: RiInboxArchiveLine,
      unstash: RiInboxUnarchiveLine,
    },
    fixed: RiPushpinFill,
    wireless: {
      enabled: RiSignalWifiLine,
      disabled: RiSignalWifiOffLine,
      removed: RiForbidLine,
    },
    add: RiAddLine,
    move: RiDragMoveLine,
    run: RiPlayLine,
    terminate: RiStopLine,
  },

  spell: {
    sustained: RiLoopLeftFill,
    notSustained: RiLoopLeftLine,
    startSustaining: RiPlayLine,
    stopSustaining: RiStopLine,
  },
}
