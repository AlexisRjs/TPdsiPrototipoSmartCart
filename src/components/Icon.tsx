const PATHS = {
  cart: 'M7 4h-2l-1 2h2l3.6 7.59-1.35 2.41A2 2 0 0 0 10 18h9v-2h-8.4a.25.25 0 0 1-.22-.37L11.1 14h6.45a2 2 0 0 0 1.79-1.11L21.7 7H6.21',
  tag: 'M20.59 13.41 12.12 4.94A2 2 0 0 0 10.7 4H5a1 1 0 0 0-1 1v5.7a2 2 0 0 0 .59 1.41l8.47 8.47a2 2 0 0 0 2.83 0l4.7-4.7a2 2 0 0 0 0-2.83ZM7.5 9A1.5 1.5 0 1 1 9 7.5 1.5 1.5 0 0 1 7.5 9Z',
  wallet: 'M20 7H5a1 1 0 0 1 0-2h14V3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1 9h-3a1 1 0 0 1 0-2h3Z',
  person: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5Z',
  store: 'M4 6 2 10v1a3 3 0 0 0 3 3v6h2v-6h10v6h2v-6a3 3 0 0 0 3-3v-1L20 6Zm7 14H9v-4h2Zm0-16h2v2h-2Z',
  check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41Z',
  tune: 'M3 17v2h6v-2H3Zm0-6v2h10v-2H3Zm0-6v2h14V5H3Zm18 2h-2.18A3 3 0 0 0 16 5a3 3 0 0 0-2.82 2H11v2h2.18A3 3 0 0 0 16 11a3 3 0 0 0 2.82-2H21Zm-5 2a1 1 0 1 1 1-1 1 1 0 0 1-1 1Zm-4 6H9.82A3 3 0 0 0 7 13a3 3 0 0 0-2.82 2H3v2h1.18A3 3 0 0 0 7 19a3 3 0 0 0 2.82-2H12Zm-5 2a1 1 0 1 1 1-1 1 1 0 0 1-1 1Z',
  trash: 'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6Zm3.5-9h1v8h-1Zm4 0h1v8h-1ZM15.5 4l-1-1h-5l-1 1H5v2h14V4Z',
  add: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6Z',
  remove: 'M19 13H5v-2h14Z',
  bolt: 'M11 21h-1l1-7H7l7-11h1l-1 7h4Z',
  spark: 'M12 2 9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5Z',
  scan: 'M4 7V4h3V2H2v5Zm16 0V2h-5v2h3v3ZM4 17v3h3v2H2v-5Zm13 3v-3h3v-2h-5v5ZM7 8h10v8H7Z',
  arrow: 'M12 4 10.59 5.41 16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8Z',
  back: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20Z',
  chevron: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6Z',
  expand: 'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6Z',
  savings: 'M12 2a8 8 0 0 0-8 8c0 3.4 2.1 6.3 5 7.5V20h6v-2.5c2.9-1.2 5-4.1 5-7.5a8 8 0 0 0-8-8Zm0 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2Z',
  receipt: 'M18 2H6v20l2-1 2 1 2-1 2 1 2-1 2 1Zm-2 14H8v-2h8Zm0-4H8v-2h8Zm0-4H8V6h8Z',
  warning: 'M1 21h22L12 2 1 21Zm12-3h-2v-2h2Zm0-4h-2v-4h2Z',
  shield: 'M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5Zm-1 15-4-4 1.41-1.41L11 13.17l5.59-5.58L18 9Z',
  search: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20ZM9.5 14A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14Z',
} as const

export type IconName = keyof typeof PATHS

export function Icon({
  name,
  size = 22,
  className,
}: {
  name: IconName
  size?: number
  className?: string
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
