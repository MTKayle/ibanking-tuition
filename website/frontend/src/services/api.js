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

// Student API
export const studentAPI = {
  getById: async (id) => {
    return authenticatedFetch(`${API_BASE_URL}/ibanking/tuition/students/${id}`, {
      method: 'GET',
    })
  },
}

// Payment API
export const paymentAPI = {
  sendOtp: async (otpRequest) => {
    return authenticatedFetch(`${API_BASE_URL}/ibanking/tuition/payments/send-otp`, {
      method: 'POST',
      body: JSON.stringify(otpRequest),
    })
  },
  
  pay: async (paymentRequest) => {
    return authenticatedFetch(`${API_BASE_URL}/ibanking/tuition/payments/pay`, {
      method: 'POST',
      body: JSON.stringify(paymentRequest),
    })
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

