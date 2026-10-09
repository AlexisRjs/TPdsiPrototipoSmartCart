import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { STORE, USER, WALLETS } from '../data/seed'
import { formatARS } from '../lib/money'
import { useAppState } from '../store/AppState'
import { BudgetDialog } from '../components/BudgetDialog'
import { useState } from 'react'

export function AccountPage() {
  const { budget, setBudget, resetTicket, totals } = useAppState()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Header title="Cuenta" />
      <div className="page">
        <section className="card profile">
          <div className="avatar lg">{USER.initials}</div>
          <div>
            <h2>{USER.name}</h2>
            <p className="muted">{USER.handle} · Cliente Plus</p>
          </div>
        </section>

        <section className="card">
          <p className="eyebrow">Sucursal activa</p>
          <h3 className="inline">
            <Icon name="store" /> {STORE.name}
          </h3>
          <p className="muted">Salida rápida por {STORE.gate}</p>
        </section>

        <section className="card">
          <div className="row-between">
            <div>
              <p className="eyebrow">Presupuesto de hoy</p>
              <p className="numeric-lg">{formatARS(budget)}</p>
              <p className="muted">Consumido {formatARS(totals.due)}</p>
            </div>
            <button className="btn btn-ghost compact" type="button" onClick={() => setOpen(true)}>
              <Icon name="tune" size={16} />
              Ajustar
            </button>
          </div>
        </section>

        <h2>Billeteras vinculadas</h2>
        <div className="stack">
          {WALLETS.map((w) => (
            <article key={w.id} className="card">
              <div className="row-between">
                <strong>{w.name}</strong>
                <span className="mini-chip lime">
                  {w.remainder ? 'Saldo libre' : `${Math.round(w.rebateRate * 100)}% tope ${formatARS(w.remainingCap)}`}
                </span>
              </div>
            </article>
          ))}
        </div>

        <button className="btn btn-ghost full" type="button" onClick={resetTicket}>
          Reiniciar compra de demostración
        </button>
      </div>
      <BudgetDialog open={open} value={budget} onClose={() => setOpen(false)} onSave={setBudget} />
    </>
  )
}
