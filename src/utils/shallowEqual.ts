export function shallowEqual(a: object | null | undefined, b: object | null | undefined): boolean {
  if (a === b)
    return true
  if (!a || !b)
    return false
  const keysA = Object.keys(a) as (keyof typeof a)[]
  if (keysA.length !== Object.keys(b).length)
    return false
  return keysA.every(key => Object.hasOwn(b, key) && Object.is(a[key], (b as typeof a)[key]))
}
