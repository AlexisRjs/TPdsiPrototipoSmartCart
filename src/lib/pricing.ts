import { roundToStep } from './money'
import type { Allocations, Product, StorePromo, Wallet } from '../types'

export function lineGross(product: Product, qty: number) {
  return product.unitPrice * qty
}

export function promoDiscount(promo: StorePromo | undefined, unitPrice: number, qty: number) {
  if (!promo || qty <= 0) return 0
  if (promo.kind === 'percent') {
    return Math.round(unitPrice * qty * (promo.rate ?? 0))
  }
  if (promo.kind === 'second_half') {
    return Math.floor(qty / 2) * Math.round(unitPrice * 0.5)
  }
  if (promo.kind === 'bogo') {
    return Math.floor(qty / 2) * unitPrice
  }
  return 0
}

export function lineDiscount(product: Product, qty: number) {
  return promoDiscount(product.storePromo, product.unitPrice, qty)
}

export function lineNet(product: Product, qty: number) {
  return lineGross(product, qty) - lineDiscount(product, qty)
}

export function walletRebate(wallet: Wallet, allocated: number) {
  if (wallet.rebateRate <= 0) return 0
  return Math.min(wallet.remainingCap, Math.round(allocated * wallet.rebateRate))
}

export function amountToMaxCap(wallet: Wallet) {
  if (wallet.rebateRate <= 0 || wallet.remainingCap <= 0) return 0
  return roundToStep(wallet.remainingCap / wallet.rebateRate)
}

export function optimalSplit(total: number, wallets: Wallet[]): Allocations {
  const alloc: Allocations = Object.fromEntries(wallets.map((w) => [w.id, 0]))
  let remaining = total

  const ranked = wallets
    .filter((w) => !w.remainder && w.rebateRate > 0 && w.remainingCap > 0)
    .sort((a, b) => b.rebateRate - a.rebateRate)

  for (const wallet of ranked) {
    const target = Math.min(remaining, amountToMaxCap(wallet))
    alloc[wallet.id] = target
    remaining -= target
  }

  const rest = wallets.find((w) => w.remainder) ?? wallets.at(-1)
  if (rest) alloc[rest.id] = remaining
  return alloc
}

export function totalAllocated(alloc: Allocations) {
  return Object.values(alloc).reduce((sum, n) => sum + n, 0)
}

export function totalRebate(alloc: Allocations, wallets: Wallet[]) {
  return wallets.reduce((sum, w) => sum + walletRebate(w, alloc[w.id] ?? 0), 0)
}
