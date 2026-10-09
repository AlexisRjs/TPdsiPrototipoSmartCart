import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { ProductTile } from '../components/ProductTile'
import { STORE, WALLETS, productById } from '../data/seed'
import { formatARS } from '../lib/money'
import { lineNet, walletRebate } from '../lib/pricing'
import { useAppState } from '../store/AppState'

export function CheckoutPage() {
  const nav = useNavigate()
  const { cart, totals, allocations, paid, pay } = useAppState()
  const [open, setOpen] = useState(false)
  const [seconds, setSeconds] = useState(15 * 60)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const t = window.setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => window.clearInterval(t)
  }, [])

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  const offPct = totals.gross ? Math.round(((totals.gross - totals.net) / totals.gross) * 100) : 0

  return (
    <>
      <Header title="Pagar y salir" backTo="/billeteras" />
      <div className="page">
        <section className="card dark-hero">
          <p className="chip chip-lime">Fast-track activo</p>
          <h2 className="hero-title">Resumen final de compra y pago</h2>
          <p>Presentá el QR en el tótem y salí sin fila de caja.</p>
        </section>

        <section className="card qr-card">
          <span className="chip">
            <span className="dot" />
            Código válido {mm}:{ss} · Compra verificada
          </span>
          <h3>QR de salida</h3>
          <p className="muted">Tótem {STORE.gate}</p>
          <div className="qr-frame" aria-hidden="true">
            <div className="qr-matrix" />
            <div className="qr-scan" />
          </div>
          <p className="numeric">#SC-84920</p>
        </section>

        <section className="card">
          <div className="row-between">
            <h2>Resumen desglosado</h2>
            <span className="count-pill">{totals.items} productos</span>
          </div>
          <div className="kv">
            <span>Subtotal carrito</span>
            <strong>{formatARS(totals.gross)}</strong>
          </div>
          <div className="kv save">
            <span>Descuentos y promociones</span>
            <strong>-{formatARS(totals.storeDiscount)}</strong>
          </div>
          <div className="kv save">
            <span>Reintegros de billeteras</span>
            <strong>-{formatARS(totals.rebate)}</strong>
          </div>
          <div className="celebrate">
            <span>Ahorraste {formatARS(totals.storeDiscount + totals.rebate)}</span>
            <span className="chip chip-dark">-{offPct}%</span>
          </div>
          <div className="kv total">
            <span>
              Total neto
              <small className="muted">Impuestos incluidos</small>
            </span>
            <strong className="hero-amount">{formatARS(totals.net)}</strong>
          </div>
        </section>

        <section className="card muted-card">
          <h2>Cobro por billetera</h2>
          {WALLETS.map((wallet) => (
            <div key={wallet.id} className="wallet-row">
              <div>
                <strong>{wallet.name}</strong>
                <p className="muted">
                  {wallet.remainder
                    ? 'Remanente sin tope'
                    : `Reintegro ${formatARS(walletRebate(wallet, allocations[wallet.id] ?? 0))}`}
                </p>
              </div>
              <span className="numeric">{formatARS(allocations[wallet.id] ?? 0)}</span>
            </div>
          ))}
        </section>

        <section className="card">
          <button
            className="accordion"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="inline">
              <Icon name="cart" />
              Detalle de productos
            </span>
            <Icon name="expand" className={open ? 'rot' : ''} />
          </button>
          {open
            ? cart.map((line) => {
                const product = productById(line.productId)
                return (
                  <div key={product.id} className="detail-row">
                    <ProductTile product={product} size={44} />
                    <div>
                      <strong>{product.name}</strong>
                      <p className="muted">
                        {line.qty} un. · {product.storePromo?.label ?? product.aisle}
                      </p>
                    </div>
                    <span className="numeric">{formatARS(lineNet(product, line.qty))}</span>
                  </div>
                )
              })
            : null}
        </section>

        <button
          className={`btn full ${paid ? 'btn-secondary' : 'btn-primary'}`}
          type="button"
          disabled={busy}
          onClick={() => {
            if (paid) {
              nav('/')
              return
            }
            setBusy(true)
            window.setTimeout(() => {
              pay()
              setBusy(false)
            }, 800)
          }}
        >
          <Icon name={paid ? 'check' : 'bolt'} />
          {busy ? 'Procesando split…' : paid ? 'Pago completado · Volver al carrito' : `Pagar ahora ${formatARS(totals.net)}`}
        </button>
        <button className="btn btn-ghost full" type="button">
          <Icon name="receipt" size={18} />
          Ticket digital
        </button>
        <p className="secure">
          <Icon name="shield" size={16} />
          Transacción cifrada por SmartCart Shield
        </p>
      </div>
    </>
  )
}
