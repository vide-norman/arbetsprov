import { getMaxFontSize } from './getMaxFontSize'

export const resizeText = (text: HTMLElement, wrapper: HTMLElement) => {
  let currentSizePercent = Number(text.style.fontSize.replace('%', ''))
  const maxFontSize = getMaxFontSize(wrapper, text)

  if (maxFontSize === currentSizePercent) return

  requestAnimationFrame(() => {
    text.style.fontSize = `${maxFontSize}%`
    currentSizePercent = maxFontSize
  })
}
