'use client'

import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Selamat datang, {user?.name || user?.email}!</h2>
        <p className="text-gray-600">
          Ini adalah halaman dashboard. Gunakan menu di sidebar untuk navigasi.
        </p>
      </div>
    </div>
  )
}
