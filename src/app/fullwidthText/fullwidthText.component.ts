import { Component, ElementRef, ViewChild } from '@angular/core'
import { setMaxFontSize } from '../../utils/setMaxFontSize'

@Component({
  selector: 'fullwidth-text',
  standalone: true,
  templateUrl: './fullwidthText.component.html',
  styleUrls: ['./fullwidthText.component.scss'],
})
export class FullwidthText {
  @ViewChild('containerElement') containerElement?: ElementRef<HTMLElement>
  @ViewChild('textElement') textElement?: ElementRef<HTMLElement>

  private containerObserver?: ResizeObserver
  private textObserver?: ResizeObserver

  ngAfterViewInit() {
    const container = this.containerElement?.nativeElement
    const text = this.textElement?.nativeElement

    if (!container || !text) return

    this.containerObserver = new ResizeObserver(() =>
      setMaxFontSize(text, container),
    )

    this.textObserver = new ResizeObserver(() => {
      setMaxFontSize(text, container)
    })

    this.containerObserver.observe(container)
    this.textObserver.observe(text)
  }

  ngOnDestroy() {
    this.containerObserver?.disconnect
    this.textObserver?.disconnect
  }
}
