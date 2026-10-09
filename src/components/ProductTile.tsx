import type { Product } from '../types'

export function ProductTile({ product, size = 56 }: { product: Product; size?: number }) {
  return (
    <div
      className="product-tile"
      style={{ width: size, height: size, background: `${product.accent}33` }}
      aria-hidden="true"
    >
      <span style={{ fontSize: size * 0.28 }}>{product.name.slice(0, 2).toUpperCase()}</span>
    </div>
  )
}
