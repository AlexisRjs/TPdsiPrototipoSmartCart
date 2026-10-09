import { useState } from 'react'
import { formatARS } from '../lib/money'

export function BudgetDialog({
  open,
  value,
  onClose,
  onSave,
}: {
  open: boolean
  value: number
  onClose: () => void
  onSave: (n: number) => void
}) {
  const [draft, setDraft] = useState(String(value))

  if (!open) return null

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Ajustar presupuesto"
      >
        <p className="sheet-title">Ajustar presupuesto</p>
        <p className="muted">
          Tope visual para no pasarte en el súper.
          <br />
          Actual: <strong>{formatARS(value)}</strong>
        </p>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 22,
              color: 'var(--muted)',
              pointerEvents: 'none',
            }}
          >
            $
          </span>
          <input
            className="text-input"
            inputMode="numeric"
            value={draft}
            style={{ paddingLeft: 36 }}
            autoFocus
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
          />
        </div>
        <button
          className="btn btn-primary full"
          type="button"
          onClick={() => {
            const n = Number(draft)
            if (n > 0) onSave(n)
            onClose()
          }}
        >
          Guardar presupuesto
        </button>
        <button
          className="btn btn-ghost full"
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
