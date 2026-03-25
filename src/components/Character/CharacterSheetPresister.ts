export class LocalStoragePresister<TData> {
  constructor(
    private readonly storageKeyPrefix: string,
    private readonly migrate?: (data: unknown) => TData,
  ) {}

  save(itemId: string, data: TData): void {
    try {
      globalThis.localStorage?.setItem(
        `${this.storageKeyPrefix}${itemId}`,
        JSON.stringify(data),
      )
    } catch {
      /* storage unavailable */
    }
  }

  load(itemId: string): TData | undefined {
    const rawValue =
      globalThis.localStorage?.getItem(`${this.storageKeyPrefix}${itemId}`) ??
      undefined

    if (!rawValue) return undefined

    if (this.migrate) {
      try {
        const parsed = JSON.parse(rawValue)
        return this.migrate(parsed)
      } catch {
        return undefined
      }
    }
  }
}
