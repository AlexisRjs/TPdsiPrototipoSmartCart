import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BudgetDialog } from '../components/BudgetDialog'
import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { ProductTile } from '../components/ProductTile'
import { ScanSheet } from '../components/ScanSheet'
import { STORE, productById } from '../data/seed'
import { formatARS } from '../lib/money'
import { lineDiscount, lineNet } from '../lib/pricing'
import { useAppState } from '../store/AppState'

export function CartPage() {
  const nav = useNavigate()
  const { cart, totals, budget, setBudget, updateQty, removeLine, scanNext } = useAppState()
  const [scanOpen, setScanOpen] = useState(false)
  const [scanMsg, setScanMsg] = useState<string | null>(null)
  const [budgetOpen, setBudgetOpen] = useState(false)

  return (
    <>
      <Header title="Carrito" />
      <div className="page page-cart">
        <div className="store-badge-row">
          <span className="chip nowrap">
            <Icon name="store" size={16} />
            {STORE.name}
          </span>
        </div>

        <section className="card hero-card">
          <div className="row-between">
            <div>
              <p className="eyebrow muted">Total a pagar</p>
              <p className="hero-amount nowrap">
                {formatARS(totals.due)}
                <span className="currency">ARS</span>
              </p>
            </div>
            <div className="align-right">
              <p className="eyebrow muted">Presupuesto</p>
              <p className="numeric nowrap">{formatARS(budget)}</p>
            </div>
          </div>
          <div className="meter-copy">
            <span className="nowrap">
              {formatARS(totals.due)} de {formatARS(budget)}
            </span>
            <strong className="nowrap">{totals.budgetPct}%</strong>
          </div>
          <div className="meter">
            <div style={{ width: `${totals.budgetPct}%` }} />
          </div>
          <div className="row-between wrap">
            <span className="chip chip-soft nowrap">
              <Icon name="check" size={16} />
              Te quedan {formatARS(totals.remainingBudget)}
            </span>
            <button className="text-btn nowrap" type="button" onClick={() => setBudgetOpen(true)}>
              Ajustar <Icon name="tune" size={16} />
            </button>
          </div>
        </section>

        <div className="row-between section-heading">
          <h2>
            Artículos
            <span className="count-pill nowrap">
              {totals.items} ítems ({totals.units} un.)
            </span>
          </h2>
        </div>

        <div className="stack">
          {cart.map((line) => {
            const product = productById(line.productId)
            const discount = lineDiscount(product, line.qty)
            return (
              <article key={line.productId} className="card item-card">
                <ProductTile product={product} />
                <div className="item-body">
                  <div className="row-between item-title-row">
                    <h3>{product.name}</h3>
                    <button
                      className="icon-btn ghost"
                      type="button"
                      aria-label="Quitar"
                      onClick={() => removeLine(line.productId)}
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                  <p className="price-line">
                    <strong className="nowrap">{formatARS(lineNet(product, line.qty))}</strong>
                    <span className="nowrap">({formatARS(product.unitPrice)} c/u)</span>
                    {discount > 0 ? <span className="save nowrap">-{formatARS(discount)}</span> : null}
                  </p>
                  <div className="row-between item-footer-row">
                    <span className="mini-chip">{product.storePromo?.label ?? product.aisle}</span>
                    <div className="stepper">
                      <button
                        type="button"
                        aria-label={`Quitar una unidad de ${product.name}`}
                        onClick={() => updateQty(line.productId, -1)}
                      >
                        <Icon name="remove" size={18} />
                      </button>
                      <span>{line.qty}</span>
                      <button
                        type="button"
                        aria-label={`Agregar una unidad de ${product.name}`}
                        onClick={() => updateQty(line.productId, 1)}
                      >
                        <Icon name="add" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <button className="insight" type="button" onClick={() => nav('/promos')}>
          <span className="insight-icon">
            <Icon name="savings" />
          </span>
          <span className="insight-copy">
            <span className="eyebrow">Optimización Smart</span>
            <span>
              Ahorrás {formatARS(totals.storeDiscount + totals.rebate)} entre promos y billeteras
            </span>
          </span>
          <Icon name="chevron" />
        </button>
      </div>

      <button
        className="fab"
        type="button"
        onClick={() => {
          const added = scanNext()
          setScanMsg(added ? `Sumamos ${added.name}` : null)
          setScanOpen(true)
        }}
      >
        <Icon name="scan" />
        Escanear producto
      </button>

      <div className="checkout-bar">
        <div className="checkout-bar-info">
          <p className="eyebrow muted">Subtotal actual</p>
          <p className="numeric-lg nowrap">{formatARS(totals.due)}</p>
        </div>
        <button className="btn btn-primary nowrap" type="button" onClick={() => nav('/promos')}>
          Ver promos y pagar
          <Icon name="arrow" size={18} />
        </button>
      </div>

      <ScanSheet open={scanOpen} message={scanMsg} onClose={() => setScanOpen(false)} />
      <BudgetDialog
        open={budgetOpen}
        value={budget}
        onClose={() => setBudgetOpen(false)}
        onSave={setBudget}
      />
    </>
  )
}
