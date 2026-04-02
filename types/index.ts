export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl?: string | null
}

export interface Workspace {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  updatedAt: string
  owner?: User
  members?: WorkspaceMember[]
  _count?: { projects: number; members: number }
}

export interface WorkspaceMember {
  id: string
  workspaceId: string
  userId: string
  role: 'owner' | 'admin' | 'member' | 'guest'
  joinedAt: string
  user?: User
}

export interface Project {
  id: string
  workspaceId: string
  name: string
  key: string
  description?: string | null
  icon?: string | null
  color?: string | null
  archived: boolean
  createdAt: string
  updatedAt: string
  lists?: List[]
  views?: View[]
}

export interface List {
  id: string
  projectId: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  sortOrder: number
  tasks?: Task[]
}

export interface Task {
  id: string
  projectId: string
  listId?: string | null
  sprintId?: string | null
  parentId?: string | null
  title: string
  description?: string | null
  type: 'task' | 'story' | 'epic' | 'bug'
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done' | 'cancelled'
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none'
  assigneeId?: string | null
  reporterId: string
  estimate?: number | null
  timeEstimate?: number | null
  timeSpent?: number | null
  startDate?: string | null
  dueDate?: string | null
  completedAt?: string | null
  sortOrder: number
  assignee?: User | null
  reporter?: User
  list?: List | null
  tags?: TaskTag[]
  checklist?: ChecklistItem[]
  comments?: Comment[]
  _count?: { subtasks: number; comments: number }
}

export interface Tag {
  id: string
  workspaceId: string
  name: string
  color: string
}

export interface TaskTag {
  taskId: string
  tagId: string
  tag: Tag
}

export interface Comment {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: string
  updatedAt: string
  author?: User
}

export interface ChecklistItem {
  id: string
  taskId: string
  content: string
  completed: boolean
  sortOrder: number
}

export interface Sprint {
  id: string
  projectId: string
  name: string
  goal?: string | null
  status: 'planning' | 'active' | 'completed'
  startDate: string
  endDate: string
  _count?: { tasks: number }
}

export interface Goal {
  id: string
  workspaceId: string
  name: string
  description?: string | null
  color: string
  startDate?: string | null
  targetDate?: string | null
  status: 'on_track' | 'at_risk' | 'off_track' | 'achieved' | 'cancelled'
  _count?: { tasks: number }
}

export interface TimeEntry {
  id: string
  taskId: string
  userId: string
  description?: string | null
  duration: number
  date: string
  user?: User
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  read: boolean
  actionUrl?: string | null
  createdAt: string
}

export interface View {
  id: string
  projectId: string
  name: string
  type: 'list' | 'board' | 'calendar' | 'gantt'
  config: Record<string, unknown>
  filters: Record<string, unknown>
  sortBy: unknown[]
  isDefault: boolean
}