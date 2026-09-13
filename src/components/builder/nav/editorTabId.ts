import { BuilderSectionId, builderSectionOrder, builderSections } from "#/components/builder/sections/builderSectionId.ts"

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

export const getEditorTabLabel = (id: EditorTabId): string =>
  isFinalizeTab(id) ? "Finalize" : builderSections[id].label
