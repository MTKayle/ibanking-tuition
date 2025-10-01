// API Configuration
const API_BASE_URL = 'http://localhost:8081' // API Gateway URL

// Helper function to handle API responses
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const error = (data && data.message) || response.statusText
    throw new Error(error)
  }

  return data
}

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/ibanking/tuition/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    return handleResponse(response)
  },
}

// Get stored token
export const getToken = () => {
  return localStorage.getItem('token')
}

// Set token
export const setToken = (token) => {
  localStorage.setItem('token', token)
}

// Remove token
export const removeToken = () => {
  localStorage.removeItem('token')
}

// Helper to make authenticated requests
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  return handleResponse(response)
}

