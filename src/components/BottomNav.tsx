import { NavLink } from 'react-router-dom'
import { Icon, type IconName } from './Icon'

const TABS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Carrito', icon: 'cart' },
  { to: '/promos', label: 'Promos', icon: 'tag' },
  { to: '/billeteras', label: 'Billeteras', icon: 'wallet' },
  { to: '/cuenta', label: 'Cuenta', icon: 'person' },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Principal">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}
          aria-label={tab.label}
        >
          <span className="nav-icon-wrap">
            <Icon name={tab.icon} size={22} />
          </span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
