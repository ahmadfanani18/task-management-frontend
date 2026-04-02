'use client'

import { useAuth } from '@/hooks/useAuth'

export default function MyTasksPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tasks</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Tugas Saya</h2>
        <p className="text-gray-600">
          Daftar tugas yang ditugaskan kepada Anda akan muncul di sini.
        </p>
      </div>
    </div>
  )
}
