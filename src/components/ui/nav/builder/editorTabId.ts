import { BuilderSectionId, builderSectionOrder, builderSections } from "#/components/builder/builderSectionId.ts"
import { isAdept } from "#/components/runner/awakenings/adept/adeptPowers/viewer/adeptPowersUtils.ts"
import { isMagician } from "#/components/runner/awakenings/magician/viewer/magicianUtils.ts"
import { isTechnomancer } from "#/components/runner/awakenings/technomancer/viewer/technomancerUtils.ts"
import type { AwakeningType } from "#/system/model/magic/awakeningType.ts"

export const FINALIZE_TAB_ID = "finalize" as const

export type EditorTabId = BuilderSectionId | typeof FINALIZE_TAB_ID

export const editorTabOrder: EditorTabId[] = [...builderSectionOrder, FINALIZE_TAB_ID]

// Reputation, Karma, and Finances track play-time state (reputation events, the karma log,
// nuyen upkeep/loans) that a Runner doesn't have yet during character creation.
const runtimeOnlySectionIds: BuilderSectionId[] = [
  BuilderSectionId.reputation,
  BuilderSectionId.karma,
  BuilderSectionId.finances,
]

export const builderTabOrder: EditorTabId[] = [
  ...builderSectionOrder.filter((id) => !runtimeOnlySectionIds.includes(id)),
  FINALIZE_TAB_ID,
]

export const isFinalizeTab = (id: EditorTabId): id is typeof FINALIZE_TAB_ID => id === FINALIZE_TAB_ID

// Mirrors the self-gating each resource section already does (e.g. SpellsBuilderSection returns
// null when `!isMagician(awakening)`) — kept out of the tab list entirely, rather than letting a
// tab navigate to a section that renders nothing.
const awakeningGatedTabs: Partial<Record<EditorTabId, (awakening: AwakeningType) => boolean>> = {
  [BuilderSectionId.spells]: isMagician,
  [BuilderSectionId.adeptPowers]: isAdept,
  [BuilderSectionId.complexForms]: isTechnomancer,
  [BuilderSectionId.sprites]: isTechnomancer,
}

export const getVisibleTabOrder = (tabOrder: EditorTabId[], awakening: AwakeningType): EditorTabId[] =>
  tabOrder.filter((id) => {
    const isVisibleForAwakening = awakeningGatedTabs[id]
    return !isVisibleForAwakening || isVisibleForAwakening(awakening)
  })

export const getEditorTabLabel = (id: EditorTabId): string =>
  isFinalizeTab(id) ? "Finalize" : builderSections[id].label
