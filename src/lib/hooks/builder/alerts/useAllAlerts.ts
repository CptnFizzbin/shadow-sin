import type { AlertInfo } from "#/components/ui/alerts/alertInfo.ts"
import { useBuildPointsAlerts } from "#/lib/hooks/builder/buildPoints/useBuildPointsAlerts.ts"
import { useBiologyAlerts } from "#/lib/hooks/builder/sections/biology/useBiologyAlerts.ts"
import { useGearAlerts } from "#/lib/hooks/builder/sections/gear/useGearAlerts.ts"
import { useProfileAlerts } from "#/lib/hooks/builder/sections/profile/useProfileAlerts.ts"
import { useQualitiesAlerts } from "#/lib/hooks/builder/sections/qualities/useQualitiesAlerts.ts"
import { useAdeptPowersAlerts } from "#/lib/hooks/builder/sections/resources/adept/useAdeptPowersAlerts.ts"
import { useSpellsAlerts } from "#/lib/hooks/builder/sections/resources/magician/useSpellsAlerts.ts"
import {
  useComplexFormsAlerts,
} from "#/lib/hooks/builder/sections/resources/technomancer/complexForms/useComplexFormsAlerts.ts"
import {
  useSpritesAlerts,
} from "#/lib/hooks/builder/sections/resources/technomancer/sprites/useSpritesAlerts.ts"
import { useSkillsAlerts } from "#/lib/hooks/builder/sections/skills/useSkillsAlerts.ts"
import { useSkillsSummaryAlerts } from "#/lib/hooks/builder/sections/skills/useSkillsSummaryAlerts.ts"

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
