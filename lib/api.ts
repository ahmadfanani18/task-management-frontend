import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiErrorResponse {
  error?: string
  details?: unknown
}

class ApiClientError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let refreshSubscribers: Array<(token: string) => void> = []

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback)
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token))
  refreshSubscribers = []
}

async function handleTokenRefresh(): Promise<string | null> {
  try {
    const res = await axios.post(
      `${API_URL}/api/auth/refresh`,
      {},
      { withCredentials: true }
    )
    return res.data.token
  } catch {
    refreshSubscribers = []
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }
}

api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/me')) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(api(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const token = await handleTokenRefresh()
        isRefreshing = false

        if (token) {
          onTokenRefreshed(token)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        }
      } catch {
        isRefreshing = false
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    }

    const data = error.response?.data as ApiErrorResponse | undefined
    const message = data?.error || error.message || 'Request failed'
    return Promise.reject(new ApiClientError(message, error.response?.status || 500, data?.details))
  }
)

const apiClient = {
  get: <T>(url: string) =>
    api.get<T>(url).then((res) => res.data),

  post: <T>(url: string, data?: unknown) =>
    api.post<T>(url, data).then((res) => res.data),

  patch: <T>(url: string, data?: unknown) =>
    api.patch<T>(url, data).then((res) => res.data),

  put: <T>(url: string, data?: unknown) =>
    api.put<T>(url, data).then((res) => res.data),

  delete: <T>(url: string) =>
    api.delete<T>(url).then((res) => res.data),
}

export { ApiClientError as ApiError }
export { apiClient }
export default apiClient