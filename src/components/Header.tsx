import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { USER } from '../data/seed'

export function Header({
  title,
  backTo,
}: {
  title: string
  backTo?: string
}) {
  return (
    <header className="app-header">
      <div className="brand">
        {backTo ? (
          <Link to={backTo} className="icon-btn" aria-label="Volver">
            <Icon name="back" />
          </Link>
        ) : null}
        <div className="logo-mark" aria-hidden="true">
          SC
        </div>
        <div className="brand-copy">
          <span className="eyebrow">SmartCart</span>
          <h1>{title}</h1>
        </div>
      </div>
      <Link to="/cuenta" className="avatar" aria-label="Cuenta">
        {USER.initials}
      </Link>
    </header>
  )
}
