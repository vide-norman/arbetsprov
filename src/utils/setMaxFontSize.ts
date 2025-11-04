export const setMaxFontSize = (text: HTMLElement, wrapper: HTMLElement) => {
  let currentSizePercent = Number(text.style.fontSize.replace('%', ''))

  const elementSizePercent = wrapper.offsetWidth / text.offsetWidth
  const maxFontSize = Math.floor(currentSizePercent * elementSizePercent)

  if (maxFontSize === currentSizePercent) return

  requestAnimationFrame(() => {
    text.style.fontSize = `${maxFontSize}%`
    currentSizePercent = maxFontSize
  })
}
