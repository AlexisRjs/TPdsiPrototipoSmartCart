import { useEffect, useState } from 'react'
import { Icon } from './Icon'

export function ScanSheet({
  open,
  message,
  onClose,
}: {
  open: boolean
  message: string | null
  onClose: () => void
}) {
  const [phase, setPhase] = useState<'scan' | 'done'>('scan')

  useEffect(() => {
    if (!open) {
      setPhase('scan')
      return
    }
    const t = window.setTimeout(() => setPhase('done'), 900)
    return () => window.clearTimeout(t)
  }, [open])

  if (!open) return null

  const success = phase === 'done' && !!message

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div
        className="sheet scan-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Escanear producto"
        aria-live="polite"
      >
        <div className="viewfinder">
          {phase === 'scan' && <div className="scan-line" />}
          {phase === 'done' && (
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                height: '100%',
                color: success ? 'var(--mint)' : 'var(--outline)',
                animation: 'page-in 0.3s var(--ease-spring)',
              }}
            >
              <Icon name={success ? 'check' : 'scan'} size={48} />
            </div>
          )}
        </div>
        <div>
          <p className="sheet-title" style={{ marginBottom: 4 }}>
            {phase === 'scan' ? 'Apuntando al código de barras…' : success ? '¡Producto sumado!' : 'Fin de demostración'}
          </p>
          <p className="muted">
            {message ?? 'No quedan productos de demostración para escanear.'}
          </p>
        </div>
        <button
          className="btn btn-primary full"
          type="button"
          disabled={phase === 'scan'}
          onClick={onClose}
        >
          <Icon name="check" size={18} />
          {phase === 'scan' ? 'Escaneando…' : 'Listo'}
        </button>
      </div>
    </div>
  )
}
