import { useAttributeAlerts } from "#/components/CharacterBuilder/Alerts/Hooks/use-attribute-alerts.ts"
import { useBuildPointsAlerts } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-build-points-alerts.ts"
import { useBiologyAlerts } from "#/components/CharacterBuilder/Sections/Biology/use-biology-alerts.ts"
import { useContactsAlerts } from "#/components/CharacterBuilder/Sections/Contacts/use-contacts-alerts.ts"
import { useGearAlerts } from "#/components/CharacterBuilder/Sections/Gear/use-gear-alerts.ts"
import { useProfileAlerts } from "#/components/CharacterBuilder/Sections/Profile/use-profile-alerts.ts"
import { useQualitiesAlerts } from "#/components/CharacterBuilder/Sections/Qualities/use-qualities-alerts.ts"
import { useAdeptPowersAlerts } from "#/components/CharacterBuilder/Sections/Resources/Adept/use-adept-powers-alerts.ts"
import { useSpellsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Magician/use-spells-alerts.ts"
import {
  useComplexFormsAlerts,
<<<<<<<< HEAD:src/components/CharacterBuilder/Hooks/use-all-alerts.ts
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/use-complex-forms-alerts.ts"
import { useSpritesAlerts } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/use-sprites-alerts.ts"
import { useSkillsAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/use-skills-alerts.ts"
import { useSkillsSummaryAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/use-skills-summary-alerts.ts"
import type { AlertInfo } from "#/components/UI/Alerts/alert-info.ts"
========
} from '#/components/CharacterBuilder/Sections/Resources/Technomancer/ComplexForms/use-complex-forms-alerts.ts"
import {
  useSpritesAlerts,
} from '#/components/CharacterBuilder/Sections/Resources/Technomancer/Sprites/use-sprites-alerts.ts"
import { useSkillsAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsAlerts.ts"
import { useSkillsSummaryAlerts } from "#/components/CharacterBuilder/Sections/Skills/Hooks/UseSkillsSummaryAlerts.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"
>>>>>>>> origin/shadowrun-4e:src/components/CharacterBuilder/Alerts/Hooks/UseAllAlerts.ts

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
