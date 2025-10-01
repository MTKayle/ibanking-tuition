import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  History, 
  LogOut,
  Menu,
  X,
  Wallet
} from 'lucide-react'
import { useState } from 'react'

const Layout = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/pay-tuition', label: 'Thanh toán học phí', icon: CreditCard },
    { path: '/pay-for-other', label: 'Thanh toán cho SV khác', icon: Users },
    { path: '/history', label: 'Lịch sử giao dịch', icon: History },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Wallet className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-800">iBanking</h1>
            </div>
            
            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">Xin chào,</p>
                <p className="font-semibold text-gray-800">{user?.name}</p>
              </div>
              <div className="text-right border-l pl-6">
                <p className="text-sm text-gray-600">Số dư tài khoản</p>
                <p className="font-bold text-primary-600 text-lg">
                  {formatCurrency(user?.balance)}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile User Info */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Xin chào,</p>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600 mt-2">Số dư</p>
                <p className="font-bold text-primary-600">
                  {formatCurrency(user?.balance)}
                </p>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className={`md:w-64 ${isMobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            <nav className="bg-white rounded-xl shadow-md p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile Logout */}
              <button
                onClick={handleLogout}
                className="md:hidden w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </nav>

            {/* Account Info Card */}
            <div className="hidden md:block mt-6 bg-white rounded-xl shadow-md p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Thông tin tài khoản</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Số tài khoản</p>
                  <p className="font-medium">{user?.accountNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Mã sinh viên</p>
                  <p className="font-medium">{user?.studentId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-xs">{user?.email}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout

