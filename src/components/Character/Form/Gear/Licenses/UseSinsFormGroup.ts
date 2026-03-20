import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { LicenseFormState } from "#/components/Character/Form/Gear/Licenses/Forms/LicenseFormState.ts"
import type { SinFormState } from "#/components/Character/Form/Gear/Licenses/Forms/SinFormState.ts"

export function useSinsFormGroup() {
  const store = useCharacterBuilderStoreContext()
  const sins = useCharacterBuilderStore((state) => state.gear.sins)

  const addSin = (sin: SinFormState) => {
    store.setState((prev) => ({
      ...prev,
      gear: { ...prev.gear, sins: [...prev.gear.sins, sin] },
    }))
  }

  const updateSin = (sin: SinFormState) => {
    store.setState((prev) => ({
      ...prev,
      gear: {
        ...prev.gear,
        sins: prev.gear.sins.map((item) => (item.id === sin.id ? sin : item)),
      },
    }))
  }

  const removeSin = (sin: SinFormState) => {
    store.setState((prev) => ({
      ...prev,
      gear: {
        ...prev.gear,
        sins: prev.gear.sins.filter((item) => item.id !== sin.id),
        licenses: prev.gear.licenses.filter((item) => item.sinId !== sin.id),
      },
    }))
  }

  const getLicensesForSin = (sinId: string): LicenseFormState[] => {
    return store.state.gear.licenses.filter(
      (license) => license.sinId === sinId,
    )
  }

  return {
    sins,
    addSin,
    updateSin,
    removeSin,
    getLicensesForSin,
  }
}
