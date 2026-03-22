export const createRatingOptions = (options: { min: number; max: number }) => {
  const { min, max } = options
  const ratingOptions = []

  for (let i = min; i <= max; i++) {
    ratingOptions.push({ label: i.toString(), value: i.toString() })
  }

  return ratingOptions
}
