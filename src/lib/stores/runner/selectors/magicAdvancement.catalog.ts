import { selectInitiateGrade, selectSubmersionGrade } from "#/lib/stores/runner/karma/karmaSlice.selectors.ts"

export const magicAdvancementCatalog = {
  initiateGrade: selectInitiateGrade,
  submersionGrade: selectSubmersionGrade,
}
