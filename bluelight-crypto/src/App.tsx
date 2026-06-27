import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import { useSettings } from './store/useSettings'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const CoinDetail = lazy(() => import('./pages/CoinDetail'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Settings = lazy(() => import('./pages/Settings'))

function PageFallback() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="skeleton h-72 w-full" />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const theme = useSettings((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <footer className="border-t border-surface py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-ink-faint">
          <span>Market data from CoinGecko</span>
          <span>Built with React, Vite, TypeScript &amp; Tailwind CSS</span>
        </div>
      </footer>
    </div>
  )
}
