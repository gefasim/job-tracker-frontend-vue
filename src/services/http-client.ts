import axios from 'axios'
import { authBus, AUTH_EVENTS } from '@/utils/auth-bus'

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// interceptors for expired JWT ACCESS_TOKEN
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Checks if it is a 401 error, and if we have not already tried to refresh the token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      window.location.pathname !== '/login'
    ) {
      originalRequest._retry = true

      try {
        await axios.post(
          import.meta.env.VITE_API_URL + '/auth/refresh',
          {},
          { withCredentials: true },
        )

        return httpClient(originalRequest)
      } catch (refreshError) {
        if (!isCheckingSessionRequest(originalRequest.url)) {
          console.error('Session ended. Login required.')
          authBus.dispatchEvent(new Event(AUTH_EVENTS.UNAUTHORIZED))
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

function isCheckingSessionRequest(url: string) {
  return url === '/auth/profile'
}

export { httpClient }
