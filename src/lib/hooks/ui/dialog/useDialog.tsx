import type { ReactNode } from "react"
import { Fragment, useId, useRef, useState } from "react"

import type { DialogCtrl } from "#/components/ui/dialog/dialogCtrl.ts"

import { useDialogCtrl } from "./useDialogCtrl.ts"

interface DialogInstance<TProps> {
  key: number
  props: TProps
}

/**
 * Foundation for reusable `use*Dialog()` hooks. Creates one `ctrl` (reused across
 * every `open()` call) and returns `{ open, dialog }` — `dialog` is a node the
 * caller renders once, anywhere in its own JSX, alongside whatever triggers
 * `open(props)`.
 *
 * `dialog`'s rendered content remounts fresh on every `open()` call (an internal
 * key bump), so components with state frozen at first mount (e.g. TanStack
 * Form's `defaultValues`) never go stale across repeated opens with different
 * props — matching the previous `DialogApi`'s fresh-instance-per-call behavior.
 *
 * @example
 * ```tsx
 * export const useAddKarmaDialog = () => useDialog<void>((ctrl) => <AddKarmaDialog ctrl={ctrl} />)
 *
 * export const useWeaponFormDialog = () => useDialog<WeaponData, { weapon?: WeaponData }>(
 *   (ctrl, props) => <WeaponFormDialog ctrl={ctrl} {...props} />,
 * )
 * ```
 */
export function useDialog<TReturn, TProps = void>(
  render: (ctrl: DialogCtrl<TReturn>, props: TProps) => ReactNode,
): { open: (props?: TProps) => Promise<TReturn | undefined>, dialog: ReactNode } {
  const ctrl = useDialogCtrl<TReturn>()
  const [instance, setInstance] = useState<DialogInstance<TProps> | null>(null)
  const instanceId = useId()
  const nextKey = useRef(0)

  const open = (props?: TProps) => {
    setInstance({ key: nextKey.current++, props: props as TProps })
    return ctrl.open()
  }

  return {
    open,
    dialog: instance ? <Fragment key={`${instanceId}-${instance.key}`}>{render(ctrl, instance.props)}</Fragment> : null,
  }
}
