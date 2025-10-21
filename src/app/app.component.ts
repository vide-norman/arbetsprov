import { Component, ElementRef, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppQuote } from './quote/quote.component'
import { resizeText } from '../utils/resizeText'
import { getTimeDifference } from '../utils/getTimeDifference'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AppQuote],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title?: string
  selectedDate?: string
  invalidDate = false
  difference?: {
    days: number
    minutes: number
    hours: number
    seconds: number
  }

  @ViewChild('titleElement') titleElement?: ElementRef<HTMLElement>
  @ViewChild('containerElement') containerElement?: ElementRef<HTMLElement>
  @ViewChild('countdownElement') countdownElement?: ElementRef<HTMLElement>

  private timer?: ReturnType<typeof setInterval>
  private observers: ResizeObserver[] = []

  ngOnInit() {
    const storedTitle = localStorage.getItem('title')
    const storedDate = localStorage.getItem('date')

    if (storedTitle) this.title = storedTitle

    if (storedDate) {
      this.selectedDate = storedDate

      if (getTimeDifference(new Date(storedDate)) > 0) {
        this.startCountdown()
      }
    }
  }

  ngAfterViewInit() {
    const container = this.containerElement?.nativeElement
    const title = this.titleElement?.nativeElement
    const countdown = this.countdownElement?.nativeElement

    if (!container || !title || !countdown) return

    const titleObserver = new ResizeObserver(() => resizeText(title, container))

    const countdownObserver = new ResizeObserver(() =>
      resizeText(countdown, container),
    )

    const containerObserver = new ResizeObserver(() => {
      resizeText(title, container)
      resizeText(countdown, container)
    })

    titleObserver.observe(title)
    countdownObserver.observe(countdown)
    containerObserver.observe(container)

    this.observers.push(titleObserver, countdownObserver, containerObserver)
  }

  private startCountdown() {
    if (this.timer) clearInterval(this.timer)

    this.updateCountdown()

    this.timer = setInterval(() => {
      this.updateCountdown()
    }, 1000)
  }

  private updateCountdown() {
    if (!this.selectedDate) return

    const selectedDate = new Date(this.selectedDate)
    const differenceInMS = getTimeDifference(selectedDate)

    if (differenceInMS <= 0) {
      clearInterval(this.timer)
      this.difference = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return
    }

    const second = 1000
    const minute = second * 60
    const hour = minute * 60
    const day = hour * 24

    const days = Math.floor(differenceInMS / day)
    const hours = Math.floor((differenceInMS % day) / hour)
    const minutes = Math.floor((differenceInMS % hour) / minute)
    const seconds = Math.floor((differenceInMS % minute) / second)

    this.difference = {
      days,
      hours,
      minutes,
      seconds,
    }
  }

  onTitleChange(value: string) {
    localStorage.setItem('title', value)
  }

  onDateChange(newDate: string) {
    this.invalidDate = false

    if (getTimeDifference(new Date(newDate)) < 0) {
      this.invalidDate = true
      return
    }

    localStorage.setItem('date', newDate)
    this.startCountdown()
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer)
    this.observers.forEach((item) => item.disconnect())
  }
}
