import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// interceptors for expired JWT ACCESS_TOKEN
api.interceptors.response.use(
  (response) => response, // Якщо все ок, просто повертаємо відповідь
  async (error) => {
    debugger
    const originalRequest = error.config

    // Перевіряємо, чи помилка 401 і чи ми ще не пробували оновити токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Викликаємо ендпоінт для оновлення токенів.
        // Сервер має прочитати Refresh-куку і встановити нову Access-куку.
        await axios.post(
          import.meta.env.VITE_API_URL + '/auth/refresh',
          {},
          { withCredentials: true },
        )

        // Повторюємо початковий запит
        return api(originalRequest)
      } catch (refreshError) {
        // Якщо навіть refresh не вдався (напр. сесія закінчилася) — розлогінюємо
        console.error('Сесія завершена, потрібно увійти знову')
        // window.location.href = '/login';
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
