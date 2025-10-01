import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { 
  CreditCard, 
  Users, 
  TrendingUp, 
  Clock,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

const Dashboard = () => {
  const { user, transactions } = useAuth()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const quickActions = [
    {
      title: 'Thanh toán học phí',
      description: 'Thanh toán học phí cho bản thân',
      icon: CreditCard,
      color: 'bg-blue-500',
      link: '/pay-tuition'
    },
    {
      title: 'Thanh toán cho SV khác',
      description: 'Thanh toán học phí cho sinh viên khác',
      icon: Users,
      color: 'bg-purple-500',
      link: '/pay-for-other'
    }
  ]

  const stats = [
    {
      label: 'Tổng giao dịch',
      value: transactions.length,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Giao dịch tháng này',
      value: transactions.filter(t => {
        const date = new Date(t.date)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      }).length,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const recentTransactions = transactions.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Xin chào, {user?.name}!</h2>
        <p className="text-blue-100 mb-4">Chào mừng bạn đến với hệ thống thanh toán học phí iBanking</p>
        <div className="flex items-baseline space-x-2">
          <span className="text-blue-100">Số dư khả dụng:</span>
          <span className="text-3xl font-bold">{formatCurrency(user?.balance)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-4 rounded-lg`}>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-[1.02] group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">{action.title}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Giao dịch gần đây</h3>
          <Link to="/history" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1">
            <span>Xem tất cả</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {recentTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.status === 'Thành công' ? 'bg-green-50' : 'bg-yellow-50'
                      }`}>
                        {transaction.status === 'Thành công' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        -{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>Chưa có giao dịch nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

