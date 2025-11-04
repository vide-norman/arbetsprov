import { Directive, ElementRef } from '@angular/core'
import { setMaxFontSize } from '../utils/setMaxFontSize'

@Directive({
  selector: '[fullwidthText]',
  standalone: true,
})
export class FullwidthTextDirective {
  private containerObserver?: ResizeObserver
  private textObserver?: ResizeObserver

  constructor(private el: ElementRef<HTMLElement>) {}

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

    this.containerObserver = new ResizeObserver(() =>
      setMaxFontSize(text, container),
    )

    this.textObserver = new ResizeObserver(() =>
      setMaxFontSize(text, container),
    )

    this.containerObserver.observe(container)
    this.textObserver.observe(text)
  }

  ngOnDestroy() {
    this.containerObserver?.disconnect()
    this.textObserver?.disconnect()
  }
}
