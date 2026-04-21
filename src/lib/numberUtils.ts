export const NumberUtils = {
  clamp(value: number, opts: { min?: number, max?: number } = {}) {
    const { min = -Infinity, max = +Infinity } = opts

    value = Math.max(value, min)
    value = Math.min(value, max)

    return value
  },
}
