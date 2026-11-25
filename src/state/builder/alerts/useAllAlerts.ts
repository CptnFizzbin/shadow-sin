import type { AlertInfo } from "#common/alerts/alertInfo.ts"
import { useBuildPointsAlerts } from "#state/builder/buildPoints/useBuildPointsAlerts.ts"
import { useBiologyAlerts } from "#state/builder/sections/biology/useBiologyAlerts.ts"
import { useGearAlerts } from "#state/builder/sections/gear/useGearAlerts.ts"
import { useProfileAlerts } from "#state/builder/sections/profile/useProfileAlerts.ts"
import { useQualitiesAlerts } from "#state/builder/sections/qualities/useQualitiesAlerts.ts"
import { useAdeptPowersAlerts } from "#state/builder/sections/resources/adept/useAdeptPowersAlerts.ts"
import { useSpellsAlerts } from "#state/builder/sections/resources/magician/useSpellsAlerts.ts"
import {
  useComplexFormsAlerts,
} from "#state/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import {
  useSpritesAlerts,
} from "#state/builder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { useSkillsAlerts } from "#state/builder/sections/skills/useSkillsAlerts.ts"
import { useSkillsSummaryAlerts } from "#state/builder/sections/skills/useSkillsSummaryAlerts.ts"

import { useAttributeAlerts } from "./useAttributeAlerts.ts"
import { useContactsAlerts } from "./useContactsAlerts.ts"

/**
 * Aggregates alert information from every runner-builder section in a fixed order.
 *
 * @returns An array of `AlertInfo` objects containing alerts from profile, biology, attributes, qualities, skills summary, skills, spells, adept powers, sprites, complex forms, gear, contacts, and build points, in that order.
 */
export function useAllAlerts(): AlertInfo[] {
  return [
    ...useProfileAlerts(),
    ...useBiologyAlerts(),
    ...useAttributeAlerts(),
    ...useQualitiesAlerts(),
    ...useSkillsSummaryAlerts(),
    ...useSkillsAlerts(),
    ...useSpellsAlerts(),
    ...useAdeptPowersAlerts(),
    ...useSpritesAlerts(),
    ...useComplexFormsAlerts(),
    ...useGearAlerts(),
    ...useContactsAlerts(),
    ...useBuildPointsAlerts(),
  ]
}
