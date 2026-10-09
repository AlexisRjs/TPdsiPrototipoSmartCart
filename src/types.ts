export type PromoKind = 'percent' | 'second_half' | 'bogo'

export type StorePromo = {
  kind: PromoKind
  label: string
  rate?: number
}

export type Product = {
  id: string
  name: string
  brand: string
  unitPrice: number
  aisle: string
  accent: string
  storePromo?: StorePromo
  catalogOnly?: boolean
}

export type CartLine = {
  productId: string
  qty: number
}

export type Wallet = {
  id: string
  name: string
  short: string
  rebateRate: number
  remainingCap: number
  remainder: boolean
}

export type Allocations = Record<string, number>
