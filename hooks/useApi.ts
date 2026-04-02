import { useCallback } from 'react'
import { apiClient } from '@/lib/api'
import type {
  Workspace,
  Project,
  List,
  Task,
  Tag,
  Sprint,
  Goal,
  TimeEntry,
  Notification,
  View,
  WorkspaceMember,
  Comment,
  ChecklistItem,
} from '@/types'

export function useWorkspaces() {
  const getWorkspaces = useCallback(async (): Promise<Workspace[]> => {
    const data = await apiClient.get<{ workspaces: Workspace[] }>('/workspaces')
    return data.workspaces
  }, [])

  const getWorkspace = useCallback(async (id: string): Promise<Workspace> => {
    const data = await apiClient.get<{ workspace: Workspace }>(`/workspaces/${id}`)
    return data.workspace
  }, [])

  const createWorkspace = useCallback(async (name: string, slug: string): Promise<Workspace> => {
    const data = await apiClient.post<{ workspace: Workspace }>('/workspaces', { name, slug })
    return data.workspace
  }, [])

  const updateWorkspace = useCallback(async (id: string, data: Partial<Workspace>): Promise<Workspace> => {
    const result = await apiClient.patch<{ workspace: Workspace }>(`/workspaces/${id}`, data)
    return result.workspace
  }, [])

  const deleteWorkspace = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${id}`)
  }, [])

  const addMember = useCallback(async (workspaceId: string, email: string, role?: string): Promise<WorkspaceMember> => {
    const data = await apiClient.post<{ member: WorkspaceMember }>(`/workspaces/${workspaceId}/members`, { email, role })
    return data.member
  }, [])

  const updateMember = useCallback(async (workspaceId: string, userId: string, role: string): Promise<WorkspaceMember> => {
    const data = await apiClient.patch<{ member: WorkspaceMember }>(`/workspaces/${workspaceId}/members/${userId}`, { role })
    return data.member
  }, [])

  const removeMember = useCallback(async (workspaceId: string, userId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/members/${userId}`)
  }, [])

  return { getWorkspaces, getWorkspace, createWorkspace, updateWorkspace, deleteWorkspace, addMember, updateMember, removeMember }
}

export function useProjects() {
  const getProjects = useCallback(async (workspaceId: string): Promise<Project[]> => {
    const data = await apiClient.get<{ projects: Project[] }>(`/projects/workspace/${workspaceId}`)
    return data.projects
  }, [])

  const getProject = useCallback(async (id: string): Promise<Project> => {
    const data = await apiClient.get<{ project: Project }>(`/projects/${id}`)
    return data.project
  }, [])

  const createProject = useCallback(async (workspaceId: string, project: { name: string; key: string; description?: string }): Promise<Project> => {
    const data = await apiClient.post<{ project: Project }>(`/projects/workspace/${workspaceId}`, project)
    return data.project
  }, [])

  const updateProject = useCallback(async (id: string, data: Partial<Project>): Promise<Project> => {
    const result = await apiClient.patch<{ project: Project }>(`/projects/${id}`, data)
    return result.project
  }, [])

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`)
  }, [])

  const getLists = useCallback(async (projectId: string): Promise<List[]> => {
    const data = await apiClient.get<{ lists: List[] }>(`/projects/${projectId}/lists`)
    return data.lists
  }, [])

  const createList = useCallback(async (projectId: string, list: { name: string; description?: string }): Promise<List> => {
    const data = await apiClient.post<{ list: List }>(`/projects/${projectId}/lists`, list)
    return data.list
  }, [])

  return { getProjects, getProject, createProject, updateProject, deleteProject, getLists, createList }
}

export function useTasks() {
  const getTasks = useCallback(async (projectId: string): Promise<Task[]> => {
    const data = await apiClient.get<{ tasks: Task[] }>(`/tasks/project/${projectId}`)
    return data.tasks
  }, [])

  const getTask = useCallback(async (id: string): Promise<Task> => {
    const data = await apiClient.get<{ task: Task }>(`/tasks/${id}`)
    return data.task
  }, [])

  const createTask = useCallback(async (projectId: string, task: { title: string; listId?: string; description?: string; type?: string; priority?: string }): Promise<Task> => {
    const data = await apiClient.post<{ task: Task }>(`/tasks/project/${projectId}`, task)
    return data.task
  }, [])

  const updateTask = useCallback(async (id: string, task: Partial<Task>): Promise<Task> => {
    const data = await apiClient.patch<{ task: Task }>(`/tasks/${id}`, task)
    return data.task
  }, [])

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`)
  }, [])

  const addComment = useCallback(async (taskId: string, content: string): Promise<Comment> => {
    const data = await apiClient.post<{ comment: Comment }>(`/tasks/${taskId}/comments`, { content })
    return data.comment
  }, [])

  const deleteComment = useCallback(async (commentId: string): Promise<void> => {
    await apiClient.delete(`/tasks/comments/${commentId}`)
  }, [])

  const addChecklistItem = useCallback(async (taskId: string, content: string): Promise<ChecklistItem> => {
    const data = await apiClient.post<{ item: ChecklistItem }>(`/tasks/${taskId}/checklist`, { content })
    return data.item
  }, [])

  const updateChecklistItem = useCallback(async (id: string, data: { content?: string; completed?: boolean }): Promise<ChecklistItem> => {
    const result = await apiClient.patch<{ item: ChecklistItem }>(`/tasks/checklist/${id}`, data)
    return result.item
  }, [])

  const deleteChecklistItem = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/checklist/${id}`)
  }, [])

  return { getTasks, getTask, createTask, updateTask, deleteTask, addComment, deleteComment, addChecklistItem, updateChecklistItem, deleteChecklistItem }
}

export function useTags() {
  const getTags = useCallback(async (workspaceId: string): Promise<Tag[]> => {
    const data = await apiClient.get<{ tags: Tag[] }>(`/tags/workspace/${workspaceId}`)
    return data.tags
  }, [])

  const createTag = useCallback(async (workspaceId: string, tag: { name: string; color: string }): Promise<Tag> => {
    const data = await apiClient.post<{ tag: Tag }>(`/tags/workspace/${workspaceId}`, tag)
    return data.tag
  }, [])

  const updateTag = useCallback(async (id: string, tag: Partial<Tag>): Promise<Tag> => {
    const data = await apiClient.patch<{ tag: Tag }>(`/tags/${id}`, tag)
    return data.tag
  }, [])

  const deleteTag = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/tags/${id}`)
  }, [])

  const addTagToTask = useCallback(async (taskId: string, tagId: string): Promise<void> => {
    await apiClient.post(`/tags/task/${taskId}/${tagId}`)
  }, [])

  const removeTagFromTask = useCallback(async (taskId: string, tagId: string): Promise<void> => {
    await apiClient.delete(`/tags/task/${taskId}/${tagId}`)
  }, [])

  return { getTags, createTag, updateTag, deleteTag, addTagToTask, removeTagFromTask }
}

export function useSprints() {
  const getSprints = useCallback(async (projectId: string): Promise<Sprint[]> => {
    const data = await apiClient.get<{ sprints: Sprint[] }>(`/sprints/project/${projectId}`)
    return data.sprints
  }, [])

  const createSprint = useCallback(async (projectId: string, sprint: { name: string; goal?: string; startDate: string; endDate: string }): Promise<Sprint> => {
    const data = await apiClient.post<{ sprint: Sprint }>(`/sprints/project/${projectId}`, sprint)
    return data.sprint
  }, [])

  const updateSprint = useCallback(async (id: string, sprint: Partial<Sprint>): Promise<Sprint> => {
    const data = await apiClient.patch<{ sprint: Sprint }>(`/sprints/${id}`, sprint)
    return data.sprint
  }, [])

  const deleteSprint = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/sprints/${id}`)
  }, [])

  return { getSprints, createSprint, updateSprint, deleteSprint }
}

export function useGoals() {
  const getGoals = useCallback(async (workspaceId: string): Promise<Goal[]> => {
    const data = await apiClient.get<{ goals: Goal[] }>(`/goals/workspace/${workspaceId}`)
    return data.goals
  }, [])

  const createGoal = useCallback(async (workspaceId: string, goal: { name: string; description?: string; color: string; startDate?: string; targetDate?: string }): Promise<Goal> => {
    const data = await apiClient.post<{ goal: Goal }>(`/goals/workspace/${workspaceId}`, goal)
    return data.goal
  }, [])

  const updateGoal = useCallback(async (id: string, goal: Partial<Goal>): Promise<Goal> => {
    const data = await apiClient.patch<{ goal: Goal }>(`/goals/${id}`, goal)
    return data.goal
  }, [])

  const deleteGoal = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/goals/${id}`)
  }, [])

  const addTaskToGoal = useCallback(async (goalId: string, taskId: string): Promise<void> => {
    await apiClient.post(`/goals/${goalId}/tasks`, { taskId })
  }, [])

  const removeTaskFromGoal = useCallback(async (goalId: string, taskId: string): Promise<void> => {
    await apiClient.delete(`/goals/${goalId}/tasks/${taskId}`)
  }, [])

  return { getGoals, createGoal, updateGoal, deleteGoal, addTaskToGoal, removeTaskFromGoal }
}

export function useTimeEntries() {
  const getTimeEntries = useCallback(async (taskId: string): Promise<TimeEntry[]> => {
    const data = await apiClient.get<{ timeEntries: TimeEntry[] }>(`/time-entries/task/${taskId}`)
    return data.timeEntries
  }, [])

  const createTimeEntry = useCallback(async (entry: { taskId: string; duration: number; date: string; description?: string }): Promise<TimeEntry> => {
    const data = await apiClient.post<{ timeEntry: TimeEntry }>('/time-entries', entry)
    return data.timeEntry
  }, [])

  const updateTimeEntry = useCallback(async (id: string, entry: Partial<TimeEntry>): Promise<TimeEntry> => {
    const data = await apiClient.patch<{ timeEntry: TimeEntry }>(`/time-entries/${id}`, entry)
    return data.timeEntry
  }, [])

  const deleteTimeEntry = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/time-entries/${id}`)
  }, [])

  return { getTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry }
}

export function useNotifications() {
  const getNotifications = useCallback(async (): Promise<Notification[]> => {
    const data = await apiClient.get<{ notifications: Notification[] }>('/notifications')
    return data.notifications
  }, [])

  const markAsRead = useCallback(async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`)
  }, [])

  const markAllAsRead = useCallback(async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all')
  }, [])

  const deleteNotification = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`)
  }, [])

  return { getNotifications, markAsRead, markAllAsRead, deleteNotification }
}

export function useViews() {
  const getViews = useCallback(async (projectId: string): Promise<View[]> => {
    const data = await apiClient.get<{ views: View[] }>(`/views/project/${projectId}`)
    return data.views
  }, [])

  const createView = useCallback(async (projectId: string, view: { name: string; type: string }): Promise<View> => {
    const data = await apiClient.post<{ view: View }>(`/views/project/${projectId}`, view)
    return data.view
  }, [])

  const updateView = useCallback(async (id: string, view: Partial<View>): Promise<View> => {
    const data = await apiClient.patch<{ view: View }>(`/views/${id}`, view)
    return data.view
  }, [])

  const deleteView = useCallback(async (id: string): Promise<void> => {
    await apiClient.delete(`/views/${id}`)
  }, [])

  return { getViews, createView, updateView, deleteView }
}