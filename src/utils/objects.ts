export function filterSearchObject(object: object, search: string): boolean {
  return Object.values(object).some((value) => {
    return value.toString().toLowerCase().includes(search.toLowerCase());
  });
}

export function deepGet(
  object: { [key: string]: unknown },
  path: string
): unknown {
  const splittedPath = path.split(".");
  let result: { [key: string]: unknown } = object;
  for (const key of splittedPath) {
    if (typeof result != "object" || !result[key]) return null;
    result = result[key] as { [key: string]: unknown };
  }
  return result;
}
