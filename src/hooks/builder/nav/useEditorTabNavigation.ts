import { useState } from "react"

import type { EditorTabId } from "#/components/nav/builder/editorTabId.ts"
import { FINALIZE_TAB_ID } from "#/components/nav/builder/editorTabId.ts"
import { NumberUtils } from "#/utils/numberUtils.ts"

export interface UseEditorTabNavigation {
  activeTab: EditorTabId
  setActiveTab: (tab: EditorTabId) => void
  currentIndex: number
  isFirst: boolean
  isLast: boolean
  nextTab: () => void
  prevTab: () => void
  goToFinalize: () => void
}

/** Drives the active tab of a tabbed, prev/next-navigable set of pages, in `tabOrder`. */
export const useEditorTabNavigation = (
  tabOrder: EditorTabId[],
  initialTab: EditorTabId,
): UseEditorTabNavigation => {
  const [storedActiveTab, setActiveTab] = useState<EditorTabId>(initialTab)

  // A tab can drop out of `tabOrder` out from under the active tab — e.g. an awakening change
  // (Biology tab) removes Spells/Powers/Complex Forms/Sprites — leaving `storedActiveTab`
  // pointing at a tab no longer in the nav. Corrected during render (rather than in an effect) so
  // there's no extra commit showing the now-hidden tab's content:
  // https://react.dev/learn/you-might-not-need-an-effect.
  const activeTab = tabOrder.includes(storedActiveTab) ? storedActiveTab : tabOrder[0]
  if (activeTab !== storedActiveTab) {
    setActiveTab(activeTab)
  }

  const currentIndex = tabOrder.indexOf(activeTab)

  const nextTab = () => {
    const nextIndex = NumberUtils.clamp(currentIndex + 1, { max: tabOrder.length - 1 })
    setActiveTab(tabOrder[nextIndex])
  }

  const prevTab = () => {
    const prevIndex = NumberUtils.clamp(currentIndex - 1, { min: 0 })
    setActiveTab(tabOrder[prevIndex])
  }

  const goToFinalize = () => setActiveTab(FINALIZE_TAB_ID)

  return {
    activeTab,
    setActiveTab,
    currentIndex,
    isFirst: currentIndex === 0,
    isLast: currentIndex === tabOrder.length - 1,
    nextTab,
    prevTab,
    goToFinalize,
  }
}
