import { useCharacterSheet } from "#/components/Character/character-sheet-provider.tsx"

export function useDamageTrack(track: "physical" | "stun") {
  return useCharacterSheet((state) => {
    const damage = state.damage
    return damage[track]
  })
}

export function useWoundModifier() {
  const physicalDamage = useDamageTrack("physical")
  const stunDamage = useDamageTrack("stun")

  return (
    Math.floor(physicalDamage / 3) + Math.floor(stunDamage / 3)
  )
}
