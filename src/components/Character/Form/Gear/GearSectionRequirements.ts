export const GearBpAllowance = 50
export const GearNuyenPerBp = 5000
export const GearNuyenBudget = GearBpAllowance * GearNuyenPerBp
export const GearMaxAvailability = 12

export const getGearBpSpent = (totalNuyen: number) => {
  return Math.ceil(totalNuyen / GearNuyenPerBp)
}
