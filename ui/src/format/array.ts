export function arrayToString(a: string[]) {
  if (!a) {
    return null;
  }
  return a.join(', ');
}
