import { Component } from '@angular/core'

interface Quote {
  id: string
  quote: string
  author: string
}

@Component({
  selector: 'app-quote',
  standalone: true,
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss'],
})
export class AppQuote {
  quote?: string
  isLoading = false
  isError = false

  private fetchData = async (): Promise<Quote | undefined> => {
    try {
      const response = await fetch('https://dummyjson.com/quotes/random')

      if (!response.ok) {
        throw new Error(`Error code: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      this.isError = true
      console.error(error)
      return undefined
    }
  }

  async ngOnInit() {
    this.isLoading = true
    const data = await this.fetchData()
    this.isLoading = false

    if (!data) return
    this.quote = data.quote
  }
}
