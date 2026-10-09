import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { AccountPage } from './pages/AccountPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { PromosPage } from './pages/PromosPage'
import { SplitPage } from './pages/SplitPage'
import { AppStateProvider } from './store/AppState'

function Shell() {
  const { pathname } = useLocation()
  const stacked = pathname === '/billeteras' || pathname === '/pagar'

  return (
    <div className="device">
      <div className={`app-shell${stacked ? ' stacked' : ''}`}>
        <Routes>
          <Route path="/" element={<CartPage />} />
          <Route path="/promos" element={<PromosPage />} />
          <Route path="/billeteras" element={<SplitPage />} />
          <Route path="/pagar" element={<CheckoutPage />} />
          <Route path="/cuenta" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {stacked ? null : <BottomNav />}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Shell />
      </BrowserRouter>
    </AppStateProvider>
  )
}
