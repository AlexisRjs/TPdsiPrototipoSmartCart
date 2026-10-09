import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { ProductTile } from '../components/ProductTile'
import { WALLETS, productById } from '../data/seed'
import { formatARS } from '../lib/money'
import { amountToMaxCap, lineDiscount, lineGross, walletRebate } from '../lib/pricing'
import { useAppState } from '../store/AppState'

export function PromosPage() {
  const nav = useNavigate()
  const { cart, totals, addProduct, allocations } = useAppState()
  const [openShelf, setOpenShelf] = useState(false)
  const cookies = cart.find((l) => l.productId === 'chocolinas')
  const hasChips = cart.some((l) => l.productId === 'chocochips')
  const applied = cart
    .map((line) => {
      const product = productById(line.productId)
      return { line, product, discount: lineDiscount(product, line.qty) }
    })
    .filter((row) => row.discount > 0)

  return (
    <>
      <Header title="Promos" />
      <div className="page page-with-sticky">
        <section className="card dark-hero">
          <div className="row-between">
            <span className="chip chip-lime">
              <Icon name="bolt" size={14} />
              En tiempo real
            </span>
            <span>{applied.length} promos activas</span>
          </div>
          <p className="eyebrow">Aviso de ahorro</p>
          <h2 className="hero-title">¡Estás ahorrando {formatARS(totals.storeDiscount)}!</h2>
          <div className="compare">
            <div>
              <span>Subtotal original</span>
              <strong className="strike">{formatARS(totals.gross)}</strong>
            </div>
            <div className="align-right">
              <span>Total con promos</span>
              <strong className="lime">{formatARS(totals.due)}</strong>
            </div>
          </div>
        </section>

        {cookies && cookies.qty % 2 === 1 && !hasChips ? (
          <section className="card">
            <div className="opportunity">
              <span className="spark">
                <Icon name="spark" />
              </span>
              <div>
                <p className="eyebrow">Oportunidad dorada · Góndola 4</p>
                <p>
                  Agregá un paquete más de galletitas y activás <strong>2x1</strong>
                </p>
                <p className="muted">Ahorrás {formatARS(1600)} extra en el ticket.</p>
                <button className="btn btn-lime" type="button" onClick={() => setOpenShelf((v) => !v)}>
                  <Icon name="search" size={16} />
                  {openShelf ? 'Ocultar opciones' : 'Ver opciones en góndola'}
                </button>
                {openShelf ? (
                  <div className="shelf-row">
                    <ProductTile product={productById('chocochips')} size={40} />
                    <div>
                      <strong>ChocoChips Rellenas 180g</strong>
                      <p className="muted">
                        {formatARS(1600)} · {formatARS(0)} con 2x1
                      </p>
                    </div>
                    <button
                      className="btn btn-primary compact"
                      type="button"
                      onClick={() => addProduct('chocochips', 2)}
                    >
                      + Sumar
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        <h2>Promociones aplicadas</h2>
        <div className="stack">
          {applied.map(({ line, product, discount }) => (
            <article key={product.id} className="card promo-card">
              <div className="row-between">
                <div className="inline">
                  <ProductTile product={product} size={48} />
                  <div>
                    <h3>{product.name}</h3>
                    <p className="muted">{product.brand}</p>
                  </div>
                </div>
                <div className="align-right">
                  <strong className="save-lg">-{formatARS(discount)}</strong>
                  <span className="strike muted">{formatARS(lineGross(product, line.qty))}</span>
                </div>
              </div>
              <span className="mini-chip lime">{product.storePromo?.label}</span>
            </article>
          ))}
        </div>

        <section className="card muted-card">
          <div className="row-between">
            <h2>Revisor de topes</h2>
            <span className="muted">Ciclo mensual</span>
          </div>
          {WALLETS.filter((w) => !w.remainder).map((wallet) => {
            const assigned = allocations[wallet.id] ?? 0
            const used = walletRebate(wallet, assigned)
            const pct = wallet.remainingCap ? Math.round((used / wallet.remainingCap) * 100) : 0
            return (
              <div key={wallet.id} className="cap-row">
                <div className="row-between">
                  <strong>
                    {wallet.short} ({Math.round(wallet.rebateRate * 100)}% OFF)
                  </strong>
                  <span>
                    Quedan {formatARS(wallet.remainingCap - used)}
                    <span className="muted"> / {formatARS(wallet.remainingCap)}</span>
                  </span>
                </div>
                <div className="meter thin">
                  <div style={{ width: `${pct}%` }} />
                </div>
                <p className="muted">
                  Tope máximo con {formatARS(amountToMaxCap(wallet))} en esta billetera
                </p>
              </div>
            )
          })}
        </section>
      </div>

      <div className="sticky-cta">
        <div>
          <p className="eyebrow muted">A pagar estimado</p>
          <p className="numeric-lg">{formatARS(totals.due)}</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={() => nav('/billeteras')}>
          Continuar a reparto
          <Icon name="arrow" size={18} />
        </button>
      </div>
    </>
  )
}
