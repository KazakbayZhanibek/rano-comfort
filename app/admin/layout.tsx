import { ReactNode } from 'react'
import './admin-mobile.css'
import ClientSidebar from '@/components/admin/ClientSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <ClientSidebar />

      {/* ── Контент ── */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}