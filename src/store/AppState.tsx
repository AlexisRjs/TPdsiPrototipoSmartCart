import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_BUDGET,
  INITIAL_CART,
  PRODUCTS,
  WALLETS,
  productById,
} from '../data/seed'
import {
  lineDiscount,
  lineGross,
  lineNet,
  optimalSplit,
  totalAllocated,
  totalRebate,
} from '../lib/pricing'
import { clamp, roundToStep } from '../lib/money'
import type { Allocations, CartLine, Product } from '../types'

type AppStateValue = {
  cart: CartLine[]
  budget: number
  setBudget: (n: number) => void
  allocations: Allocations
  setWalletAmount: (walletId: string, amount: number) => void
  applyOptimal: () => void
  balanceRemainder: () => void
  paid: boolean
  pay: () => void
  resetTicket: () => void
  addProduct: (productId: string, qty?: number) => void
  updateQty: (productId: string, delta: number) => void
  removeLine: (productId: string) => void
  scanNext: () => Product | null
  products: Product[]
  totals: {
    units: number
    items: number
    gross: number
    storeDiscount: number
    due: number
    rebate: number
    net: number
    allocated: number
    remainingBudget: number
    budgetPct: number
  }
}

const AppStateContext = createContext<AppStateValue | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(INITIAL_CART)
  const [budget, setBudget] = useState(DEFAULT_BUDGET)
  const [allocations, setAllocations] = useState<Allocations>(() =>
    optimalSplit(
      INITIAL_CART.reduce((sum, line) => {
        const p = productById(line.productId)
        return sum + lineNet(p, line.qty)
      }, 0),
      WALLETS,
    ),
  )
  const [paid, setPaid] = useState(false)

  const totals = useMemo(() => {
    let gross = 0
    let storeDiscount = 0
    let units = 0
    for (const line of cart) {
      const product = productById(line.productId)
      gross += lineGross(product, line.qty)
      storeDiscount += lineDiscount(product, line.qty)
      units += line.qty
    }
    const due = gross - storeDiscount
    const rebate = totalRebate(allocations, WALLETS)
    const allocated = totalAllocated(allocations)
    return {
      units,
      items: cart.length,
      gross,
      storeDiscount,
      due,
      rebate,
      net: Math.max(0, due - rebate),
      allocated,
      remainingBudget: Math.max(0, budget - due),
      budgetPct: budget > 0 ? Math.min(100, Math.round((due / budget) * 100)) : 0,
    }
  }, [allocations, budget, cart])

  const redistribute = useCallback((due: number, next?: Allocations) => {
    setAllocations(next ?? optimalSplit(due, WALLETS))
  }, [])

  const addProduct = useCallback((productId: string, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      const next = existing
        ? prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l))
        : [...prev, { productId, qty }]
      const due = next.reduce((sum, line) => sum + lineNet(productById(line.productId), line.qty), 0)
      redistribute(due)
      return next
    })
    setPaid(false)
  }, [redistribute])

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((l) => (l.productId === productId ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
      const due = next.reduce((sum, line) => sum + lineNet(productById(line.productId), line.qty), 0)
      redistribute(due)
      return next
    })
    setPaid(false)
  }, [redistribute])

  const removeLine = useCallback((productId: string) => {
    setCart((prev) => {
      const next = prev.filter((l) => l.productId !== productId)
      const due = next.reduce((sum, line) => sum + lineNet(productById(line.productId), line.qty), 0)
      redistribute(due)
      return next
    })
    setPaid(false)
  }, [redistribute])

  const scanNext = useCallback(() => {
    const inCart = new Set(cart.map((l) => l.productId))
    const candidate = PRODUCTS.find((p) => p.catalogOnly && !inCart.has(p.id))
    if (!candidate) return null
    addProduct(candidate.id, 1)
    return candidate
  }, [addProduct, cart])

  const setWalletAmount = useCallback(
    (walletId: string, amount: number) => {
      setAllocations((prev) => ({
        ...prev,
        [walletId]: clamp(roundToStep(amount), 0, totals.due),
      }))
      setPaid(false)
    },
    [totals.due],
  )

  const applyOptimal = useCallback(() => {
    redistribute(totals.due)
    setPaid(false)
  }, [redistribute, totals.due])

  const balanceRemainder = useCallback(() => {
    const rest = WALLETS.find((w) => w.remainder)
    if (!rest) return
    setAllocations((prev) => {
      const others = WALLETS.filter((w) => w.id !== rest.id).reduce(
        (sum, w) => sum + (prev[w.id] ?? 0),
        0,
      )
      return { ...prev, [rest.id]: Math.max(0, totals.due - others) }
    })
  }, [totals.due])

  const pay = useCallback(() => {
    if (totals.allocated !== totals.due || totals.due <= 0) return
    setPaid(true)
  }, [totals.allocated, totals.due])

  const resetTicket = useCallback(() => {
    setCart(INITIAL_CART)
    setPaid(false)
    const due = INITIAL_CART.reduce(
      (sum, line) => sum + lineNet(productById(line.productId), line.qty),
      0,
    )
    redistribute(due)
  }, [redistribute])

  const value: AppStateValue = {
    cart,
    budget,
    setBudget,
    allocations,
    setWalletAmount,
    applyOptimal,
    balanceRemainder,
    paid,
    pay,
    resetTicket,
    addProduct,
    updateQty,
    removeLine,
    scanNext,
    products: PRODUCTS,
    totals,
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState debe usarse dentro de AppStateProvider')
  return ctx
}
