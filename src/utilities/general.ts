export const incrementOrInstantiate = (
  obj: Record<string, number>,
  property,
  incrementAmount = 1
) => {
  if (typeof obj?.[property] === "undefined") {
    obj[property] = incrementAmount;
  } else {
    obj[property] += incrementAmount;
  }
};
