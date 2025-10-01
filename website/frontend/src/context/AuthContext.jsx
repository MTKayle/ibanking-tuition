import { createContext, useContext, useState, useEffect } from 'react'

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
    const storedTransactions = localStorage.getItem('transactions')
    
    if (storedUser) {
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
          recipient: 'SV202401234',
          description: 'Học phí học kỳ 1 năm 2025'
        },
        {
          id: 'TXN002',
          date: '2025-08-20',
          type: 'Thanh toán học phí',
          amount: 15000000,
          status: 'Thành công',
          recipient: 'SV202401234',
          description: 'Học phí học kỳ 2 năm 2024'
        }
      ]
      setTransactions(sampleTransactions)
      localStorage.setItem('transactions', JSON.stringify(sampleTransactions))
    }
  }, [])

  const login = (accountNumber, password) => {
    // Demo login - accept any non-empty credentials
    if (accountNumber && password) {
      const userData = {
        name: 'Nguyễn Văn A',
        accountNumber: accountNumber,
        studentId: 'SV202401234',
        balance: 50000000,
        email: 'nguyenvana@student.edu.vn'
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, message: 'Số tài khoản hoặc mật khẩu không đúng' }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
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

