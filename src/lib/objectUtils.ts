export const ObjectUtils = {
  keys<TObject extends object>(obj: TObject) {
    return Object.keys(obj) as (keyof TObject)[]
  },
}
