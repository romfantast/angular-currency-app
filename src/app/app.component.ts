import { Component, OnInit } from '@angular/core'
import { nanoid } from 'nanoid'
import { Notify } from 'notiflix'
import { CurrencyApi } from './currencyAPI/currencyAPI.servise'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currencyJson: any = {}
  historyList: any = []
  isLoading: boolean = false
  step: number = 0

  from: string = ''
  to: string = ''
  amount: string = ''

  today: string = new Date().toISOString().split('T')[0]
  usdToday = ''
  euroToday = ''

  inputValue1: string = ''
  inputValue2: string = ''

  constructor(private currency: CurrencyApi) {}

  ngOnInit(): void {
    console.log(this.today)

    const promise1 = new Promise((res, rej) => {
      return this.currency.getUsdRateToday().subscribe(data => {
        this.usdToday = JSON.parse(JSON.stringify(data)).result.toFixed(2)
      })
    })
    const promise2 = new Promise((res, rej) => {
      return this.currency.getEuroRateToday().subscribe(data => {
        this.euroToday = JSON.parse(JSON.stringify(data)).result.toFixed(2)
      })
    })

    Promise.all([promise1, promise2])
      .then(data => console.log(data))
      .catch(error => console.log(error))
  }

  setFromOrTo(e: any) {
    const { id, value } = e.target
    if (id === 'currency1') {
      this.from = value
      this.amount = this.inputValue1
    } else if (id === 'currency2') {
      this.to = value
    }
  }

  setInputValue1(a: string) {
    this.inputValue1 = a.trim()
  }
  setInputValue2(a: string) {
    this.inputValue2 = a.trim()
  }

  setAmount(e: any) {
    this.amount = e.target.value
    if (e.target.name === 'input2' && this.step === 0) {
      let t = this.from
      this.from = this.to
      this.to = t
      this.step = 2
    }
  }

  convert() {
    if (!this.from || !this.to || !this.amount) {
      return
    }
    if (!Number(this.amount)) {
      Notify.failure('not valid input type')
      return
    }
    this.isLoading = true
    this.currency
      .getCurrencyData(this.from, this.to, this.amount)
      .subscribe(data => {
        this.currencyJson = JSON.parse(JSON.stringify(data))
        console.log(this.currencyJson)
        if (this.currencyJson.query.amount.toString() === this.inputValue1) {
          this.inputValue2 = String(this.currencyJson.result.toFixed(2))
        } else if (
          this.currencyJson.query.amount.toString() === this.inputValue2
        ) {
          this.inputValue1 = String(this.currencyJson.result.toFixed(2))
        }
        this.isLoading = false
        Notify.success('Success convertaition')

        const newConvertation = {
          id: nanoid(),
          from: this.from,
          to: this.to,
          amount: this.amount,
          result: this.currencyJson.result
        }
        this.historyList.push(newConvertation)
        if (this.step === 2) {
          let t = this.from
          this.from = this.to
          this.to = t
          this.step = 0
        }
      })
  }

  deleteTransaction(id: string) {
    this.historyList = this.historyList.filter(
      (transaction: any) => transaction.id !== id
    )
    Notify.info('Transaction deleted')
  }
}
