export function calculateSetWeight(
  setWeight: number | null,
  exerciseIsBodyWeight: boolean,
  userBodyWeight: number | null,
): number {
  if (setWeight != null && setWeight > 0) {
    return setWeight;
  }

  if (exerciseIsBodyWeight && userBodyWeight != null) {
    return userBodyWeight;
  }

  return 0;
}
