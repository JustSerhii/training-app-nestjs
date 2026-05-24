export function calculateSetWeight(
  setWeight: number | null,
  exerciseIsBodyWeight: boolean,
  userBodyWeight: number | null,
): number {
  const addedWeight = setWeight != null && setWeight > 0 ? setWeight : 0;
  const baseWeight =
    exerciseIsBodyWeight && userBodyWeight != null ? userBodyWeight : 0;

  return baseWeight + addedWeight;
}
