import { Directive, ElementRef } from '@angular/core'
import { getMaxFontSize } from '../utils/getMaxFontSize'

@Directive({
  selector: '[fullwidthText]',
  standalone: true,
})
export class FullwidthTextDirective {
  constructor(private el: ElementRef<HTMLElement>) {}

  private containerObserver?: ResizeObserver
  private textObserver?: ResizeObserver
  private textWidth?: number
  private containerWidth?: number

  private onResize = (text: HTMLElement, wrapper: HTMLElement) => {
    let currentFontSize = Number(text.style.fontSize.replace('%', ''))
    const maxFontSize = getMaxFontSize(currentFontSize, wrapper, text)

    if (maxFontSize === currentFontSize) return

    text.style.fontSize = `${maxFontSize}%`
    this.textWidth = text.offsetWidth
    this.containerWidth = wrapper.offsetWidth
  }

  ngAfterViewInit() {
    const container = this.el.nativeElement
    const text = container.firstElementChild as HTMLElement | null

    if (!text || !text?.textContent?.length) {
      console.warn('[fullwidthText] expects a child element with text content.')
      return
    }

    text.style.display = 'inline-block'
    text.style.whiteSpace = 'nowrap'
    text.style.fontSize = '100%'

    this.containerObserver = new ResizeObserver(() => {
      if (this.containerWidth === container.offsetWidth) return
      this.onResize(text, container)
    })

    this.textObserver = new ResizeObserver(() => {
      if (this.textWidth === text.offsetWidth) return
      this.onResize(text, container)
    })

    this.containerObserver.observe(container)
    this.textObserver.observe(text)
  }

  ngOnDestroy() {
    this.containerObserver?.disconnect()
    this.textObserver?.disconnect()
  }
}
