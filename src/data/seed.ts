import type { CartLine, Product, Wallet } from '../types'

export const STORE = {
  name: 'Coto · Sucursal Belgrano',
  gate: 'Tótem Puerta Norte',
}

export const USER = {
  name: 'Ana López',
  handle: '@ana.lopez',
  initials: 'AL',
}

export const DEFAULT_BUDGET = 30_000

export const PRODUCTS: Product[] = [
  {
    id: 'leche',
    name: 'Leche Entera La Serenísima 1L',
    brand: 'Pack familiar',
    unitPrice: 1450,
    aisle: 'Góndola 3 · Lácteos',
    accent: '#7dd3c0',
    storePromo: { kind: 'second_half', label: '2do al 50%' },
  },
  {
    id: 'cafe',
    name: 'Café Tostado Molido 250g',
    brand: 'Café Martínez Grano Selecto',
    unitPrice: 4800,
    aisle: 'Góndola 7 · Infusiones',
    accent: '#c4a574',
    storePromo: { kind: 'percent', rate: 0.15, label: '15% Clientes Plus' },
  },
  {
    id: 'chocolinas',
    name: 'Galletitas Chocolinas 250g',
    brand: 'Bagley',
    unitPrice: 1600,
    aisle: 'Góndola 4 · Galletitas',
    accent: '#e07a5f',
  },
  {
    id: 'queso',
    name: 'Queso Cremoso 500g',
    brand: 'Lácteos La Serenísima',
    unitPrice: 6000,
    aisle: 'Fiambrería',
    accent: '#f2d08b',
  },
  {
    id: 'chocochips',
    name: 'ChocoChips Rellenas 180g',
    brand: 'Compatible con 2x1',
    unitPrice: 1600,
    aisle: 'Góndola 4 · Galletitas',
    accent: '#d4a373',
    storePromo: { kind: 'bogo', label: '2x1 Activado' },
    catalogOnly: true,
  },
  {
    id: 'yogurt',
    name: 'Yogur Natural Firm 190g',
    brand: 'La Serenísima',
    unitPrice: 890,
    aisle: 'Góndola 3 · Lácteos',
    accent: '#9ad1d4',
    catalogOnly: true,
  },
  {
    id: 'bananas',
    name: 'Bananas Cavendish Premium',
    brand: '1 kg aprox.',
    unitPrice: 2200,
    aisle: 'Frutas y verduras',
    accent: '#e9c46a',
    catalogOnly: true,
  },
]

export const INITIAL_CART: CartLine[] = [
  { productId: 'leche', qty: 2 },
  { productId: 'cafe', qty: 1 },
  { productId: 'chocolinas', qty: 3 },
  { productId: 'queso', qty: 1 },
]

export const WALLETS: Wallet[] = [
  {
    id: 'modo',
    name: 'Modo · Banco BBVA',
    short: 'Modo',
    rebateRate: 0.3,
    remainingCap: 3000,
    remainder: false,
  },
  {
    id: 'dni',
    name: 'Cuenta DNI',
    short: 'Cuenta DNI',
    rebateRate: 0.2,
    remainingCap: 1500,
    remainder: false,
  },
  {
    id: 'mp',
    name: 'Mercado Pago / Débito',
    short: 'Mercado Pago',
    rebateRate: 0,
    remainingCap: 0,
    remainder: true,
  },
]

export function productById(id: string) {
  const product = PRODUCTS.find((p) => p.id === id)
  if (!product) throw new Error(`Producto no encontrado: ${id}`)
  return product
}
