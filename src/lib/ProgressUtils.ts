export const getProgress = (current: number, total: number): number => {
  if (total === 0) return 0
  const percentage = Math.round((current / total) * 100)
  if (percentage > 100) return 100
  if (percentage < 0) return 0
  return percentage
}
