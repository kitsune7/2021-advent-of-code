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

export const logicalSort = (a, b) => (a < b ? -1 : 1);

export function deepCopy(
  jsonData: Record<string, unknown> | Array<unknown>
): typeof jsonData {
  return JSON.parse(JSON.stringify(jsonData));
}
