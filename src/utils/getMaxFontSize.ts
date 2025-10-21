export const getMaxFontSize = (container: HTMLElement, text: HTMLElement) => {
  const currentSizePercent = Number(text.style.fontSize.replace('%', ''))
  const elementSizePercent = container.offsetWidth / text.offsetWidth
  const maxFontSize = Math.floor(currentSizePercent * elementSizePercent)
  return maxFontSize
}
