export function prefixWithArticle(
  prefix: string | null,
  plural: boolean,
  name: string
) {
  const s = prefix || name;
  if (prefix) {
    prefix = ` ${prefix}`;
  } else {
    prefix = '';
  }
  if (plural) {
    return `Some${prefix}`;
  }
  const firstChar = s.substr(0, 1);
  if (['a', 'e', 'i', 'o', 'u'].includes(firstChar)) {
    return `An${prefix}`;
  }
  return `A${prefix}`;
}
