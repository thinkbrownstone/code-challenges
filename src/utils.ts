export const replaceUnderscores = (text: string) => {
  const textArr = text.split('_').map((char: string) => char[0].toUpperCase() + char.substring(1));
  return textArr.join(' / ');
}