export function enumToOptions<T extends object>(enumType: T) {

  return Object.keys(enumType)
    .filter(key => isNaN(Number(key)))
    .map(key => ({
      value: enumType[key as keyof T],
      label: key
    }));
}