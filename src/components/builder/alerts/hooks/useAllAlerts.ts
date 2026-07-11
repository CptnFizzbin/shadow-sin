import { useBuildPointsAlerts } from "#/components/builder/buildPoints/hooks/useBuildPointsAlerts.ts"
import { useBiologyAlerts } from "#/components/builder/sections/biology/useBiologyAlerts.ts"
import { useGearAlerts } from "#/components/builder/sections/gear/useGearAlerts.ts"
import { useProfileAlerts } from "#/components/builder/sections/profile/useProfileAlerts.ts"
import { useQualitiesAlerts } from "#/components/builder/sections/qualities/useQualitiesAlerts.ts"
import { useAdeptPowersAlerts } from "#/components/builder/sections/resources/adept/useAdeptPowersAlerts.ts"
import { useSpellsAlerts } from "#/components/builder/sections/resources/magician/useSpellsAlerts.ts"
import {
  useComplexFormsAlerts,
} from "#/components/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import {
  useSpritesAlerts,
} from "#/components/builder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { useSkillsAlerts } from "#/components/builder/sections/skills/hooks/useSkillsAlerts.ts"
import { useSkillsSummaryAlerts } from "#/components/builder/sections/skills/hooks/useSkillsSummaryAlerts.ts"
import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"

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
