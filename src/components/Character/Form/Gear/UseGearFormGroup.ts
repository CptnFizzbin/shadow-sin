import { useStore } from "@tanstack/react-store"
import type {
  LicenseFormItem,
  PlayerCharacterForm,
  SinFormItem,
} from "#/components/Character/Form/UseCharacterForm.ts"

export const GEAR_NUYEN_BUDGET = 250_000
export const GEAR_NUYEN_PER_BP = 5_000
export const GEAR_BP_ALLOWANCE = GEAR_NUYEN_BUDGET / GEAR_NUYEN_PER_BP
export const SIN_COST_PER_RATING = 1_000
export const LICENSE_COST_PER_RATING = 100
export const SIN_MAX_RATING = 4
export const LICENSE_MAX_RATING = 4
export const DEFAULT_MAX_AVAILABILITY = 12

export function computeSinNuyen(sin: SinFormItem): number {
  return sin.kind === "fake" ? sin.rating * SIN_COST_PER_RATING : 0
}

export function computeLicenseNuyen(
  license: LicenseFormItem,
  sins: SinFormItem[],
): number {
  const parentSin = sins.find((sin) => sin.id === license.sinId)
  if (!parentSin || parentSin.kind === "real") return 0
  return license.rating * LICENSE_COST_PER_RATING
}

export function computeTotalGearNuyen(
  sins: SinFormItem[],
  licenses: LicenseFormItem[],
): number {
  const sinTotal = sins.reduce((sum, sin) => sum + computeSinNuyen(sin), 0)
  const licenseTotal = licenses.reduce(
    (sum, license) => sum + computeLicenseNuyen(license, sins),
    0,
  )
  return sinTotal + licenseTotal
}

export function computeGearBP(totalNuyen: number): number {
  return Math.floor(totalNuyen / GEAR_NUYEN_PER_BP)
}

export function computeSinAvailability(sin: SinFormItem): string {
  if (sin.kind === "real") return "-"
  return `${sin.rating * 3}F`
}

export function computeLicenseAvailability(
  license: LicenseFormItem,
  sins: SinFormItem[],
): string {
  const parentSin = sins.find((sin) => sin.id === license.sinId)
  if (!parentSin || parentSin.kind === "real") return "-"
  return `${license.rating * 3}F`
}

export function formatNuyen(amount: number): string {
  if (amount === 0) return "-"
  return `${amount.toLocaleString()}¥`
}

export function useGearFormGroup(form: PlayerCharacterForm) {
  const sins = useStore(form.store, (state) => state.values.gear.sins)
  const licenses = useStore(form.store, (state) => state.values.gear.licenses)
  const maxAvailability = useStore(
    form.store,
    (state) => state.values.gear.maxAvailability,
  )

  const totalNuyen = computeTotalGearNuyen(sins, licenses)
  const gearBP = computeGearBP(totalNuyen)
  const isOverBudget = totalNuyen > GEAR_NUYEN_BUDGET
  const hasRealSin = sins.some((sin) => sin.kind === "real")

  function syncBuildPoints(
    updatedSins: SinFormItem[],
    updatedLicenses: LicenseFormItem[],
  ) {
    form.setFieldValue(
      "buildPoints.spent.gear",
      computeGearBP(computeTotalGearNuyen(updatedSins, updatedLicenses)),
    )
  }

  function addSin(sinData: Omit<SinFormItem, "id">) {
    const newSin: SinFormItem = { id: crypto.randomUUID(), ...sinData }
    const updatedSins = [...sins, newSin]
    form.setFieldValue("gear.sins", updatedSins)
    syncBuildPoints(updatedSins, licenses)
  }

  function updateSin(sinId: string, updates: Partial<Omit<SinFormItem, "id">>) {
    const updatedSins = sins.map((sin) =>
      sin.id === sinId ? { ...sin, ...updates } : sin,
    )
    form.setFieldValue("gear.sins", updatedSins)
    syncBuildPoints(updatedSins, licenses)
  }

  function removeSin(sinId: string) {
    const updatedSins = sins.filter((sin) => sin.id !== sinId)
    const updatedLicenses = licenses.filter((lic) => lic.sinId !== sinId)
    form.setFieldValue("gear.sins", updatedSins)
    form.setFieldValue("gear.licenses", updatedLicenses)
    syncBuildPoints(updatedSins, updatedLicenses)
  }

  function addLicense(licenseData: Omit<LicenseFormItem, "id">) {
    const newLicense: LicenseFormItem = {
      id: crypto.randomUUID(),
      ...licenseData,
    }
    const updatedLicenses = [...licenses, newLicense]
    form.setFieldValue("gear.licenses", updatedLicenses)
    syncBuildPoints(sins, updatedLicenses)
  }

  function updateLicense(
    licenseId: string,
    updates: Partial<Omit<LicenseFormItem, "id">>,
  ) {
    const updatedLicenses = licenses.map((lic) =>
      lic.id === licenseId ? { ...lic, ...updates } : lic,
    )
    form.setFieldValue("gear.licenses", updatedLicenses)
    syncBuildPoints(sins, updatedLicenses)
  }

  function removeLicense(licenseId: string) {
    const updatedLicenses = licenses.filter((lic) => lic.id !== licenseId)
    form.setFieldValue("gear.licenses", updatedLicenses)
    syncBuildPoints(sins, updatedLicenses)
  }

  return {
    sins,
    licenses,
    maxAvailability,
    totalNuyen,
    gearBP,
    isOverBudget,
    hasRealSin,
    addSin,
    updateSin,
    removeSin,
    addLicense,
    updateLicense,
    removeLicense,
  }
}
