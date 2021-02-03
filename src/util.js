export function capitalize(str) {
  return str
    .split('_')
    .map((substr) => substr[0].toUpperCase() + substr.slice(1))
    .join(' ');
}
