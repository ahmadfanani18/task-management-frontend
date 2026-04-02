'use client'

import { useEffect, useState } from 'react'
import { useWorkspaces } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import type { Workspace } from '@/types'

export default function ProjectsPage() {
  const { user } = useAuth()
  const { getWorkspaces } = useWorkspaces()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadWorkspaces()
  }, [])

  async function loadWorkspaces() {
    try {
      const data = await getWorkspaces()
      setWorkspaces(data)
    } catch (err) {
      if (err instanceof Error) setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
          + New Workspace
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {workspaces.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Belum ada workspace.</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
            Buat Workspace Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {workspaces.map((workspace) => (
            <div key={workspace.id} className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{workspace.name}</h2>
                <p className="text-sm text-gray-500">/{workspace.slug}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{workspace._count?.projects || 0} projects</span>
                  <span>{workspace._count?.members || 0} members</span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                    Settings
                  </button>
                  <Link
                    href={`/projects/${workspace.id}`}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Open
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
