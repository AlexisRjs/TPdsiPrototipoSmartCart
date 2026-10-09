import { useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Icon } from '../components/Icon'
import { WALLETS } from '../data/seed'
import { formatARS, formatARSPlain } from '../lib/money'
import { amountToMaxCap, totalAllocated, walletRebate } from '../lib/pricing'
import { useAppState } from '../store/AppState'

export function SplitPage() {
  const nav = useNavigate()
  const { totals, allocations, setWalletAmount, applyOptimal, balanceRemainder } = useAppState()
  const allocated = totalAllocated(allocations)
  const diff = allocated - totals.due
  const balanced = diff === 0 && totals.due > 0

  return (
    <>
      <Header title="Reparto óptimo" backTo="/promos" />
      <div className="page">
        <section className="card">
          <div className="row-between">
            <span className="muted inline">
              <Icon name="cart" size={16} /> Monto del carrito
            </span>
            <span className="chip chip-live">Ahorro {formatARS(totals.rebate)}</span>
          </div>
          <div className="row-between">
            <p className="hero-amount">{formatARS(totals.due)}</p>
            <div className="align-right">
              <p className="muted">Pagás neto</p>
              <p className="numeric-lg save">{formatARS(totals.net)}</p>
            </div>
          </div>
          <p className="meter-copy">
            <span>Distribución del pago</span>
            <strong className={balanced ? 'save' : 'danger'}>
              {balanced ? '100% cubierto' : `${Math.round((allocated / Math.max(totals.due, 1)) * 100)}% asignado`}
            </strong>
          </p>
          <div className="split-bar">
            {WALLETS.map((w) => (
              <div
                key={w.id}
                className={`seg seg-${w.id}`}
                style={{ width: `${totals.due ? ((allocations[w.id] ?? 0) / totals.due) * 100 : 0}%` }}
              />
            ))}
          </div>
          <div className="legend">
            {WALLETS.map((w) => (
              <span key={w.id}>
                <i className={`seg-${w.id}`} />
                {w.short}
              </span>
            ))}
          </div>
        </section>

        <button className="optimizer" type="button" onClick={applyOptimal}>
          <span className="spark">
            <Icon name="spark" />
          </span>
          <span>
            <strong>Reparto óptimo automático</strong>
            <small>Agota topes y no pierde reintegros</small>
          </span>
          <span className="chip chip-lime">Máximo ahorro</span>
        </button>

        <div className="stack">
          {WALLETS.map((wallet) => {
            const amount = allocations[wallet.id] ?? 0
            const rebate = walletRebate(wallet, amount)
            const maxAt = amountToMaxCap(wallet)
            return (
              <article key={wallet.id} className="card">
                <div className="row-between">
                  <div>
                    <h3>{wallet.name}</h3>
                    <div className="inline wrap">
                      <span className="mini-chip lime">
                        {wallet.remainder
                          ? 'Saldo libre'
                          : `${Math.round(wallet.rebateRate * 100)}% reintegro`}
                      </span>
                      <span className="muted">
                        {wallet.remainder
                          ? 'Absorbe el resto'
                          : `Tope disp: ${formatARS(wallet.remainingCap)}`}
                      </span>
                    </div>
                  </div>
                  <div className="align-right">
                    <p className="eyebrow">Ahorro activo</p>
                    <p className={rebate ? 'save numeric' : 'muted numeric'}>
                      {rebate ? `+${formatARS(rebate)}` : formatARS(0)}
                    </p>
                  </div>
                </div>
                <div className="row-between">
                  <span className="muted">Monto asignado</span>
                  <span className="amount-pill">${formatARSPlain(amount)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={totals.due}
                  step={100}
                  value={Math.min(amount, totals.due)}
                  onChange={(e) => setWalletAmount(wallet.id, Number(e.target.value))}
                />
                <p className="muted center-note">
                  {wallet.remainder
                    ? 'Cubre el saldo restante'
                    : amount >= maxAt
                      ? `Tope de ${formatARS(wallet.remainingCap)} aprovechado`
                      : `Llegás al tope con ${formatARS(maxAt)}`}
                </p>
              </article>
            )
          })}
        </div>

        <div className={`status-card ${balanced ? 'ok' : 'warn'}`}>
          <Icon name={balanced ? 'check' : 'warning'} />
          <p>
            {balanced
              ? `Suma total coincide con el changuito (${formatARS(totals.due)}).`
              : diff < 0
                ? `Faltan repartir ${formatARS(Math.abs(diff))}`
                : `Excedido por ${formatARS(diff)}`}
          </p>
          <button className="ghost-pill" type="button" onClick={balanceRemainder}>
            Equilibrar
          </button>
        </div>

        <button
          className="btn btn-primary full"
          type="button"
          disabled={!balanced}
          onClick={() => nav('/pagar')}
        >
          Confirmar reparto y avanzar
          <Icon name="arrow" size={18} />
        </button>
      </div>
    </>
  )
}
