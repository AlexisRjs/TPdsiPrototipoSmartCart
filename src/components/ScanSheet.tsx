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

  return (
    <div className="sheet-backdrop" onClick={onClose} role="presentation">
      <div className="sheet scan-sheet" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="viewfinder">
          <div className="scan-line" />
        </div>
        <p className="sheet-title">
          {phase === 'scan' ? 'Apuntando al código de barras…' : 'Producto reconocido'}
        </p>
        <p className="muted">{message ?? 'No quedan productos de demostración para escanear.'}</p>
        <button className="btn btn-primary" type="button" onClick={onClose}>
          <Icon name="check" size={18} />
          Listo
        </button>
      </div>
    </div>
  )
}
