export function formatARS(amount: number) {
  const rounded = Math.round(amount)
  return `$${rounded.toLocaleString('es-AR')}`
}

export function formatARSPlain(amount: number) {
  return Math.round(amount).toLocaleString('es-AR')
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export function roundToStep(n: number, step = 100) {
  return Math.round(n / step) * step
}
