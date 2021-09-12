const nuyenFormatter = new Intl.NumberFormat('en')
export const formatNuyen = (cost: number): string => {
  return nuyenFormatter.format(cost) + '¥'
}
