export function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    let value = obj[key];

    if (value !== null && value !== undefined) {
      value = encodeURIComponent(value).replace(/%20/g, "+");
    }

    sorted[key] = value;
  }

  return sorted;
}
