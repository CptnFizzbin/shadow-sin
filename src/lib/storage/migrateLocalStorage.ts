import type { JsonValue } from "#/lib/jsonUtils.ts"

export function migrateOldLocalStorageFormat(ls: Storage): void {
  const oldCharacterPrefix = "shadow-sin:json:characters/"
  const oldCharacterSuffix = ".json"
  const oldBuilderPrefix = "shadow-sin:character-form:"

  const keysToRemove: string[] = []
  const migrations: Array<{ newKey: string, value: string }> = []

  for (let i = 0; i < ls.length; i++) {
    const rawKey = ls.key(i)
    if (!rawKey) continue

    if (rawKey.startsWith(oldCharacterPrefix) && rawKey.endsWith(oldCharacterSuffix)) {
      const withoutPrefix = rawKey.slice(oldCharacterPrefix.length)
      const characterId = withoutPrefix.slice(0, -oldCharacterSuffix.length)
      const raw = ls.getItem(rawKey)
      if (!raw) continue

      try {
        const envelope = JSON.parse(raw) as { value?: JsonValue }
        const characterData = envelope.value ?? envelope
        migrations.push({ newKey: `shadowsin:characters/${characterId}`, value: JSON.stringify(characterData) })
        keysToRemove.push(rawKey)
      } catch {
        // Unparseable — skip, don't lose data by removing
      }
    } else if (rawKey.startsWith(oldBuilderPrefix)) {
      const characterId = rawKey.slice(oldBuilderPrefix.length)
      const raw = ls.getItem(rawKey)
      if (!raw) continue
      migrations.push({ newKey: `shadowsin:builder/character-form/${characterId}`, value: raw })
      keysToRemove.push(rawKey)
    }
  }

  for (const { newKey, value } of migrations) {
    if (!ls.getItem(newKey)) {
      ls.setItem(newKey, value)
    }
  }

  // Build / update the index from migrated characters
  if (migrations.some((m) => m.newKey.startsWith("shadowsin:characters/"))) {
    const indexKey = "shadowsin:index"
    let index: Array<{ id: string, name: string, lastModified: string }> = []
    const existing = ls.getItem(indexKey)
    if (existing) {
      try {
        index = JSON.parse(existing) as typeof index
      } catch {
        index = []
      }
    }

    const indexedIds = new Set(index.map((e) => e.id))

    for (const { newKey } of migrations) {
      if (!newKey.startsWith("shadowsin:characters/")) continue
      const characterId = newKey.slice("shadowsin:characters/".length)
      if (indexedIds.has(characterId)) continue

      try {
        const raw = ls.getItem(newKey)
        if (!raw) continue
        const data = JSON.parse(raw) as Record<string, unknown>
        const alias =
          typeof data["profile"] === "object" && data["profile"] !== null
            ? String((data["profile"] as Record<string, unknown>)["alias"] ?? characterId)
            : characterId
        index.push({ id: characterId, name: alias, lastModified: new Date().toISOString() })
        indexedIds.add(characterId)
      } catch {
        // Skip characters we can't parse for the index
      }
    }

    ls.setItem(indexKey, JSON.stringify(index))
  }

  for (const key of keysToRemove) {
    ls.removeItem(key)
  }
}
