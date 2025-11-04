import { Component, computed, signal } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AppQuote } from './quote/quote.component'
import { getTimeDifference, isFutureDate } from '../utils/dates'
import { FullwidthTextDirective } from './fullwidthText.directive'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AppQuote, FullwidthTextDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title?: string
  selectedDate?: string
  invalidDate = false
  difference?: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }

  private timer?: ReturnType<typeof setInterval>

  ngOnInit() {
    const storedTitle = localStorage.getItem('title')
    const storedDate = localStorage.getItem('date')

    if (storedTitle) this.title = storedTitle

    if (storedDate && isFutureDate(new Date(storedDate))) {
      this.selectedDate = storedDate
      this.startCountdown()
    }
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

    if (!isFutureDate(selectedDate)) {
      clearInterval(this.timer)
      this.difference = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return
    }

    const differenceInMS = getTimeDifference(selectedDate)

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

  onDateChange(date: string) {
    this.invalidDate = false

    if (!isFutureDate(new Date(date))) {
      this.invalidDate = true
      return
    }

    localStorage.setItem('date', date)
    this.startCountdown()
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer)
  }
}
