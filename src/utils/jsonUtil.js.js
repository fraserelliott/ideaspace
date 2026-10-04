export function trimValues(value) {
  if (typeof value === "string") return value.trim();

  if (Array.isArray(value)) {
    return value.map(trimValues);
  }

  if (value !== null && typeof value === "object") {
    const newObj = {};

    for (const key in value) {
      newObj[key] = trimValues(value[key]);
    }

    return newObj;
  }

  return value;
}
