export type Availability = {
  rarity: number
  illegal?: boolean
  license?: boolean
}
export const formatAvail = (avail: Availability): string => {
  return `${avail.rarity}${avail.illegal ? "(i)" : ""}${avail.license ? "(L)" : ""}`
}
