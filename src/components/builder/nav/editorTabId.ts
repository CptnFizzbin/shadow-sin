import type { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { builderSectionOrder, builderSections } from "#/components/builder/sections/builderSectionId.ts"

export const FINALIZE_TAB_ID = "finalize" as const

export type EditorTabId = BuilderSectionId | typeof FINALIZE_TAB_ID

export const editorTabOrder: EditorTabId[] = [...builderSectionOrder, FINALIZE_TAB_ID]

export const isFinalizeTab = (id: EditorTabId): id is typeof FINALIZE_TAB_ID => id === FINALIZE_TAB_ID

export const getEditorTabLabel = (id: EditorTabId): string =>
  isFinalizeTab(id) ? "Finalize" : builderSections[id].label
