export class ObjectUtils {
  public static mapValues<
    TObject extends Record<string, unknown>,
    TResult,
  >(
    obj: TObject,
    mapFn: (key: keyof TObject & string, value: TObject[keyof TObject]) => TResult,
  ): { [K in keyof TObject]: TResult } {
    return Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => [key, mapFn(key as keyof TObject & string, value as TObject[keyof TObject])]),
    ) as { [K in keyof TObject]: TResult }
  }

  public static filterEntries<
    TObject extends Record<string, unknown>,
  >(
    obj: TObject,
    filterFn: (key: keyof TObject & string, value: TObject[keyof TObject]) => boolean,
  ): Partial<TObject> {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key, value]) => filterFn(key as keyof TObject & string, value as TObject[keyof TObject])),
    ) as Partial<TObject>
  }
}
