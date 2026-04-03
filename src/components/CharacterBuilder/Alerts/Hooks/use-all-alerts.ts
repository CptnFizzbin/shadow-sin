import { useAttributeAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/use-attribute-alerts.ts"
import { useContactsAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/use-contacts-alerts.ts"
import { useBuildPointsAlerts } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-build-points-alerts.ts"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/use-biology-alerts.ts"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/use-gear-alerts.ts"
import { useProfileAlerts } from "#/components/CharacterBuilder/Sections/Profile/use-profile-alerts.ts"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/use-qualities-alerts.ts"
import { useAdeptPowersAlerts } from "#/components/CharacterBuilder/Sections/Resources/Adept/use-adept-powers-alerts.ts"
import { useSpellsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Magician/use-spells-alerts.ts"
import {
  useComplexFormsAlerts,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/use-complex-forms-alerts.ts"
import {
  useSpritesAlerts,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/use-sprites-alerts.ts"
import { useSkillsAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/use-skills-alerts.ts"
import { useSkillsSummaryAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/use-skills-summary-alerts.ts"
import type { AlertInfo } from "#/components/UI/alerts/alert-info.ts"

/**
 * Aggregates alert information from every character-builder section in a fixed order.
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
