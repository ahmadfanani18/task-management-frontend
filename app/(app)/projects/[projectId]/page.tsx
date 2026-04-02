'use client'

import { useEffect, useState, use } from 'react'
import { useProjects, useTasks } from '@/hooks/useApi'
import Link from 'next/link'
import type { Project, Task, List } from '@/types'

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params)
  const { getProject, getLists } = useProjects()
  const { getTasks } = useTasks()
  const [project, setProject] = useState<Project | null>(null)
  const [lists, setLists] = useState<List[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProject()
  }, [projectId])

  async function loadProject() {
    try {
      const [projectData, listsData, tasksData] = await Promise.all([
        getProject(projectId),
        getLists(projectId),
        getTasks(projectId),
      ])
      setProject(projectData)
      setLists(listsData)
      setTasks(tasksData)
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

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (!project) {
    return <div>Project not found</div>
  }

  const tasksByList = lists.reduce((acc, list) => {
    acc[list.id] = tasks.filter((task) => task.listId === list.id)
    return acc
  }, {} as Record<string, Task[]>)

  const priorityColors: Record<string, string> = {
    urgent: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
    none: 'bg-gray-100 text-gray-700',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link href="/projects" className="hover:text-blue-600">Projects</Link>
            <span>/</span>
            <span>{project.key}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
            Board
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
            List
          </button>
          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
            Calendar
          </button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {lists.map((list) => (
          <div key={list.id} className="flex-shrink-0 w-72 bg-gray-50 rounded-lg">
            <div className="p-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">{list.name}</h3>
                <span className="text-xs text-gray-500">{tasksByList[list.id]?.length || 0}</span>
              </div>
            </div>
            <div className="p-2 space-y-2">
              {tasksByList[list.id]?.map((task) => (
                <div key={task.id} className="bg-white rounded-md p-3 shadow-sm border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">{task.title}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority] || ''}`}>
                      {task.priority}
                    </span>
                    {task.assignee && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">
                        {task.assignee.name?.[0] || '?'}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex-shrink-0 w-72">
          <button className="w-full p-3 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
            + Add List
          </button>
        </div>
      </div>
    </div>
  )
}