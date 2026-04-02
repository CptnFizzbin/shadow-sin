import { useComplexFormsAlerts } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseComplexFormsAlerts.ts"
import { useSpritesAlerts } from "#/components/CharacterBuilder/Sections/Resources/Technomancer/UseSpritesAlerts.ts"

export const useTechnomancerAlerts = () => {
  return [
    ...useComplexFormsAlerts(),
    ...useSpritesAlerts(),
  ]
}
