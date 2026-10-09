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
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog">
        <p className="sheet-title">Presupuesto de la compra</p>
        <p className="muted">Tope visual para no pasarte en el súper. Actual: {formatARS(value)}</p>
        <input
          className="text-input"
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/\D/g, ''))}
        />
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            const n = Number(draft)
            if (n > 0) onSave(n)
            onClose()
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
