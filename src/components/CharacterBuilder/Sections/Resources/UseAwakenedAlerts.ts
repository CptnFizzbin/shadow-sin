import { useAdeptPowersAlerts } from "#/components/CharacterBuilder/Sections/Resources/Adept/UseAdeptPowersAlerts.ts"
import { useSpellsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Magician/UseSpellsAlerts.ts"
import {
  useTechnomancerAlerts,
} from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseTechnomancerAlerts.ts"
import type { AlertInfo } from "#/components/UI/Alerts/AlertInfo.ts"

export const useAwakenedAlerts = (): AlertInfo[] => {
  return [
    ...useSpellsAlerts(),
    ...useAdeptPowersAlerts(),
    ...useTechnomancerAlerts(),
  ]
}
