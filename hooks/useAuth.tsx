'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import toast from 'react-hot-toast'
import { apiClient } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string | null
  avatarUrl?: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const data = await apiClient.get<{ user: User }>('/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email: string, password: string) {
    await apiClient.post('/auth/login', { email, password })
    await checkAuth()
    toast.success('Berhasil login')
  }

  async function register(email: string, password: string, name?: string) {
    await apiClient.post('/auth/register', { email, password, name })
    toast.success('Registrasi berhasil')
  }

  async function logout() {
    await apiClient.post('/auth/logout')
    setUser(null)
    toast.success('Berhasil logout')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
