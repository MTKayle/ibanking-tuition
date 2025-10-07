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
  // Initialize state from localStorage immediately to prevent flash
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = getToken()
    return !!(storedUser && storedToken)
  })
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  
  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = localStorage.getItem('transactions')
    if (storedTransactions) {
      return JSON.parse(storedTransactions)
    }
    
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
    localStorage.setItem('transactions', JSON.stringify(sampleTransactions))
    return sampleTransactions
  })

  // Fetch latest balance when component mounts
  useEffect(() => {
    const fetchLatestBalance = async () => {
      const storedUser = localStorage.getItem('user')
      const storedToken = getToken()
      
      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser)
          const latestBalance = await authAPI.getBalance(userData.id)
          
          // Update user with latest balance
          const updatedUser = {
            ...userData,
            balance: latestBalance
          }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
        } catch (error) {
          console.error('Error fetching balance:', error)
          // If token is invalid, clear everything
          if (error.message && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem('user')
            localStorage.removeItem('transactions')
            removeToken()
          }
        }
      }
    }

    fetchLatestBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run once on mount

  const login = async (accountNumber, password) => {
    try {
      // Call auth API
      const response = await authAPI.login(accountNumber, password)
      
      // Extract user data from response
      const userData = {
        id: response.userid,
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
    localStorage.removeItem('transactions')
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

