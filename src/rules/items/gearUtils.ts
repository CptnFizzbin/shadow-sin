export const GearMaxAvailability = 12

type ItemCostInfo = {
  cost?: number
  quantity?: number
}

export const getTotalCost = (...items: ItemCostInfo[]) => {
  return items
    .map((item) => ({
      cost: item.cost ?? 0,
      quantity: item.quantity ?? 1,
    }))
    .map(({ cost, quantity }) => cost * quantity)
    .reduce((sum, itemCost) => sum + itemCost, 0)
}
