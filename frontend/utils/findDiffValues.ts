import { equals, keys } from "ramda";

export const findDiffValues = <T>(
  obj1: Partial<T>,
  obj2: Partial<T>
): Partial<T> => {
  const allKeys = [...new Set([...keys(obj1), ...keys(obj2)])] as Array<
    keyof T
  >;

  const diffs = allKeys.reduce((acc, key) => {
    if (!equals(obj1[key], obj2[key])) {
      acc[key] = obj2[key];
    }
    return acc;
  }, {} as Partial<T>);

  return diffs;
};
