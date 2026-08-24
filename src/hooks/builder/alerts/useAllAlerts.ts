import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useBuildPointsAlerts } from "#/hooks/builder/buildPoints/useBuildPointsAlerts.ts"
import { useBiologyAlerts } from "#/hooks/builder/sections/biology/useBiologyAlerts.ts"
import { useGearAlerts } from "#/hooks/builder/sections/gear/useGearAlerts.ts"
import { useProfileAlerts } from "#/hooks/builder/sections/profile/useProfileAlerts.ts"
import { useQualitiesAlerts } from "#/hooks/builder/sections/qualities/useQualitiesAlerts.ts"
import { useAdeptPowersAlerts } from "#/hooks/builder/sections/resources/adept/useAdeptPowersAlerts.ts"
import { useSpellsAlerts } from "#/hooks/builder/sections/resources/magician/useSpellsAlerts.ts"
import {
  useComplexFormsAlerts,
} from "#/hooks/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import {
  useSpritesAlerts,
} from "#/hooks/builder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { useSkillsAlerts } from "#/hooks/builder/sections/skills/useSkillsAlerts.ts"
import { useSkillsSummaryAlerts } from "#/hooks/builder/sections/skills/useSkillsSummaryAlerts.ts"

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
