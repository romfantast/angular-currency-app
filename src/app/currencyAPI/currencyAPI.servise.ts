import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CurrencyApi {
  constructor(private http: HttpClient) {}

  getCurrencyData(currency1: string, currency2: string, amount: string) {
    const headers = {
      apikey: 'MTNKt1uGINKEonQQaNUWw5TlN0W56dY1'
    }

    const base_url = 'https://api.apilayer.com/fixer/convert'
    const queryStr = `?to=${currency2}&from=${currency1}&amount=${amount}`
    const searchUrl = base_url + queryStr

    return this.http.get(searchUrl, { headers })
  }

  getUsdRateToday() {
    const headers = { apikey: '12rMNv7UPMvUvIFXMnWs5Zgle8iwV30A' }

    const base_url =
      'https://api.apilayer.com/fixer/convert?to=uah&from=usd&amount=1'

    return this.http.get(base_url, { headers })
  }
  getEuroRateToday() {
    const headers = { apikey: '12rMNv7UPMvUvIFXMnWs5Zgle8iwV30A' }

    const base_url =
      'https://api.apilayer.com/fixer/convert?to=uah&from=eur&amount=1'

    return this.http.get(base_url, { headers })
  }
}
