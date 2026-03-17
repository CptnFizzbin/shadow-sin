import { useCharacterStore } from "#/components/Character/CharacterStoreProvider.tsx";

export function useDamageTrack(track: "physical" | "stun") {
  return useCharacterStore((state) => {
    const damage = state.damage;
    return damage[track];
  });
}

export function useWoundModifier() {
  const physicalDamage = useDamageTrack("physical");
  const stunDamage = useDamageTrack("stun");

  return (
    Math.floor(physicalDamage.current / 3) + Math.floor(stunDamage.current / 3)
  );
}
