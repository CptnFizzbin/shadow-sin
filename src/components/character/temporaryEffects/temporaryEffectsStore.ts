import { StoreSlice } from "#/integrations/tanstackStore/storeSlice.ts"
import type { TemporaryEffectData } from "#/system/gameEffects/gameEffectData.ts"

export type TemporaryEffectsStoreState = TemporaryEffectData[]

export class TemporaryEffectsStore extends StoreSlice<TemporaryEffectsStoreState> {
  add(effect: TemporaryEffectData): void {
    this.set((prev) => [...prev, { ...effect, id: effect.id || crypto.randomUUID() }])
  }

  remove(id: string): void {
    this.set((prev) => prev.filter((effect) => effect.id !== id))
  }

  toggle(id: string): void {
    this.set((prev) => prev.map((effect) => effect.id === id ? { ...effect, enabled: !effect.enabled } : effect))
  }

  update(effect: TemporaryEffectData): void {
    this.set((prev) => prev.map((existing) => existing.id === effect.id ? effect : existing))
  }
}
