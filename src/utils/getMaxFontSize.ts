export const getMaxFontSize = (
  currentSize: number,
  wrapper: HTMLElement,
  text: HTMLElement,
) => {
  const elementSizePercent = wrapper.offsetWidth / text.offsetWidth
  const maxFontSize = Math.floor(currentSize * elementSizePercent)
  return maxFontSize
}
