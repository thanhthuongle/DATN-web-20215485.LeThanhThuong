export const startDayOfWeekOptions = [
  'Thứ 2',
  'Thứ 3',
  'Thứ 4',
  'Thứ 5',
  'Thứ 6',
  'Thứ 7',
  'Chủ nhật'
]
export const languageOptions = ['Tiếng Việt']
export const currencyOptions = ['VND']
export const startDayOfMonthOptions = Array.from({ length: 28 }, (_, i) => (i + 1).toString())

export const apiRoot = import.meta.env.VITE_API_URL

export const TRANSACTION_TYPES = {
  EXPENSE: 'expense',
  INCOME: 'income',
  LOAN: 'loan',
  BORROWING: 'borrowing',
  TRANSFER: 'transfer',
  CONTRIBUTION: 'contribution'
}

export const MONEY_SOURCE_TYPE = {
  ACCOUNT: 'account',
  SAVINGS_ACCOUNT: 'savings_account',
  ACCUMULATION: 'accumulation'
}
