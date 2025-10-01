import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PayTuition from './pages/PayTuition'
import PayForOther from './pages/PayForOther'
import TransactionHistory from './pages/TransactionHistory'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="pay-tuition" element={<PayTuition />} />
            <Route path="pay-for-other" element={<PayForOther />} />
            <Route path="history" element={<TransactionHistory />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

