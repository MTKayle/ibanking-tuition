import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, setToken, removeToken, getToken } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user')
    const storedToken = getToken()
    const storedTransactions = localStorage.getItem('transactions')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
    
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions))
    } else {
      // Sample transactions
      const sampleTransactions = [
        {
          id: 'TXN001',
          date: '2025-09-15',
          type: 'Thanh toán học phí',
          amount: 15000000,
          status: 'Thành công',
          recipient: 'SV202401111',
          description: 'Học phí Học kỳ 1 - Năm 2025 - Trần Thị B (SV202401111)'
        },
        {
          id: 'TXN002',
          date: '2025-08-20',
          type: 'Thanh toán cho SV khác',
          amount: 15000000,
          status: 'Thành công',
          recipient: 'SV202401222',
          description: 'Học phí Học kỳ 2 - Năm 2024 - Thanh toán cho Lê Văn C (SV202401222)'
        }
      ]
      setTransactions(sampleTransactions)
      localStorage.setItem('transactions', JSON.stringify(sampleTransactions))
    }
  }, [])

  const login = async (accountNumber, password) => {
    try {
      // Call auth API
      const response = await authAPI.login(accountNumber, password)
      
      // Extract user data from response
      const userData = {
        name: response.fullName,
        accountNumber: accountNumber,
        balance: response.balance,
        email: response.email,
        phoneNumber: response.phoneNumber
      }
      
      // Store token
      setToken(response.token)
      
      // Update state
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại số tài khoản và mật khẩu.' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    removeToken()
  }

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: `TXN${String(transactions.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Thành công'
    }
    const updatedTransactions = [newTransaction, ...transactions]
    setTransactions(updatedTransactions)
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions))
    
    // Update balance
    const updatedUser = {
      ...user,
      balance: user.balance - transaction.amount
    }
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    return newTransaction
  }

  const value = {
    isAuthenticated,
    user,
    transactions,
    login,
    logout,
    addTransaction
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

