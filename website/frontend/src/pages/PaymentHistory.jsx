import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { paymentAPI, studentAPI } from '../services/api'
import { 
  History, 
  CheckCircle, 
  XCircle, 
  Filter,
  Download,
  Calendar,
  Search,
  TrendingUp,
  FileText,
  Receipt,
  Sparkles,
  Loader2,
  AlertCircle,
  DollarSign
} from 'lucide-react'

const PaymentHistory = () => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [error, setError] = useState('')
  const [studentCache, setStudentCache] = useState({})

  useEffect(() => {
    fetchPaymentHistory()
  }, [user])

  const fetchPaymentHistory = async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const history = await paymentAPI.getHistory(user.id)
      setTransactions(history)
      setError('')
      
      // Fetch student names for all transactions
      const studentIds = [...new Set(history.map(t => t.studentid))]
      const cache = {}
      
      await Promise.all(
        studentIds.map(async (studentId) => {
          try {
            const student = await studentAPI.getById(studentId)
            cache[studentId] = student.fullname
          } catch (err) {
            cache[studentId] = `SV${studentId}`
          }
        })
      )
      
      setStudentCache(cache)
    } catch (err) {
      setError('Không thể tải lịch sử giao dịch. Vui lòng thử lại!')
      console.error('Fetch history error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status) => {
    switch (status) {
      case 'SUCCESS':
        return {
          label: 'Thành công',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        }
      case 'FAILED_DEDUCT':
        return {
          label: 'Thất bại (Không trừ tiền)',
          color: 'bg-red-100 text-red-800',
          icon: XCircle,
          iconColor: 'text-red-600'
        }
      case 'FAILED_MARKPAID_REFUNDED':
        return {
          label: 'Thất bại (Đã hoàn tiền)',
          color: 'bg-yellow-100 text-yellow-800',
          icon: XCircle,
          iconColor: 'text-yellow-600'
        }
      case 'CRITICAL_REFUND_FAILED':
        return {
          label: 'Thất bại nghiêm trọng',
          color: 'bg-red-100 text-red-800',
          icon: XCircle,
          iconColor: 'text-red-600'
        }
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: FileText,
          iconColor: 'text-gray-600'
        }
    }
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    const studentName = studentCache[transaction.studentid] || `SV${transaction.studentid}`
    const matchesSearch = studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         String(transaction.studentid).includes(searchTerm)
    const matchesDate = !dateFilter || formatDate(transaction.createdAt).includes(dateFilter)
    
    return matchesStatus && matchesSearch && matchesDate
  })

  // Calculate statistics
  const totalAmount = filteredTransactions
    .filter(t => t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0)
  const successCount = filteredTransactions.filter(t => t.status === 'SUCCESS').length

  const handleExport = () => {
    const csvContent = [
      ['Mã GD', 'Ngày', 'Sinh viên', 'Số tiền', 'Trạng thái'],
      ...filteredTransactions.map(t => [
        t.id,
        formatDate(t.createdAt),
        studentCache[t.studentid] || `SV${t.studentid}`,
        t.amount,
        getStatusInfo(t.status).label
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `lich-su-thanh-toan-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gray-200 rounded-2xl h-48 animate-pulse"></div>
        <div className="bg-gray-200 rounded-xl h-40 animate-pulse"></div>
        <div className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
      </div>
    )
  }

  // Error state
  if (error && !isLoading) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Có lỗi xảy ra</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPaymentHistory}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with animated gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden animate-fade-in">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-white rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm animate-bounce-slow">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Lịch sử thanh toán</h2>
              <p className="text-blue-100 text-sm mt-1">Theo dõi tất cả giao dịch thanh toán học phí</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm">Tổng giao dịch</p>
                <FileText className="h-5 w-5 text-blue-200" />
              </div>
              <p className="text-3xl font-bold">{filteredTransactions.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-150">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm">Thành công</p>
                <CheckCircle className="h-5 w-5 text-green-300" />
              </div>
              <p className="text-3xl font-bold">{successCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-blue-100 text-sm">Tổng tiền</p>
                <DollarSign className="h-5 w-5 text-blue-200" />
              </div>
              <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in animation-delay-200">
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center space-x-2">
            <Filter className={`h-5 w-5 text-gray-600 transition-transform duration-300 ${showFilters ? 'rotate-0' : 'rotate-180'}`} />
            <h3 className="font-semibold text-gray-800">Bộ lọc và tìm kiếm</h3>
          </div>
          <Sparkles className={`h-5 w-5 text-primary-500 transition-all duration-300 ${showFilters ? 'rotate-0' : 'rotate-180'}`} />
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
                    <span>Tìm kiếm</span>
                  </div>
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên sinh viên, mã SV..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300"
                />
              </div>

              {/* Status Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Receipt className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
                    <span>Trạng thái</span>
                  </div>
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300"
                >
                  <option value="all">Tất cả</option>
                  <option value="SUCCESS">Thành công</option>
                  <option value="FAILED_DEDUCT">Thất bại (Không trừ tiền)</option>
                  <option value="FAILED_MARKPAID_REFUNDED">Thất bại (Đã hoàn tiền)</option>
                  <option value="CRITICAL_REFUND_FAILED">Thất bại nghiêm trọng</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
                    <span>Tháng</span>
                  </div>
                </label>
                <input
                  type="month"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  setFilterStatus('all')
                  setSearchTerm('')
                  setDateFilter('')
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-all hover:scale-105"
              >
                🔄 Xóa bộ lọc
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in animation-delay-400">
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mã GD
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sinh viên
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredTransactions.map((transaction, index) => {
                  const statusInfo = getStatusInfo(transaction.status)
                  const StatusIcon = statusInfo.icon
                  
                  return (
                    <tr 
                      key={transaction.id} 
                      onClick={() => setSelectedTransaction(transaction)}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] animate-slide-in-right"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {transaction.id.substring(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(transaction.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-primary-600">
                          {studentCache[transaction.studentid] || `SV${transaction.studentid}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-bold px-3 py-1 rounded-lg ${
                          transaction.status === 'SUCCESS' 
                            ? 'text-red-600 bg-red-50' 
                            : 'text-gray-500 bg-gray-50'
                        }`}>
                          -{formatCurrency(transaction.status === 'SUCCESS' ? transaction.amount : 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-110 ${statusInfo.color}`}>
                          <StatusIcon className={`h-3.5 w-3.5 ${statusInfo.iconColor}`} />
                          <span>{statusInfo.label}</span>
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center animate-fade-in">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <History className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có giao dịch</h3>
            <p className="text-gray-500">Chưa có giao dịch thanh toán nào được thực hiện.</p>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={() => setSelectedTransaction(null)}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-lg w-full transform animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Chi tiết giao dịch</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-mono text-xs text-gray-900 bg-gray-100 px-3 py-1 rounded">{selectedTransaction.id}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Ngày thực hiện:</span>
                <span className="font-medium text-gray-900">{formatDate(selectedTransaction.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Sinh viên:</span>
                <span className="font-semibold text-primary-600">
                  {studentCache[selectedTransaction.studentid] || `SV${selectedTransaction.studentid}`}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Mã sinh viên:</span>
                <span className="font-medium text-gray-900">SV{selectedTransaction.studentid}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Số tiền:</span>
                <span className={`font-bold text-2xl ${
                  selectedTransaction.status === 'SUCCESS' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  -{formatCurrency(selectedTransaction.status === 'SUCCESS' ? selectedTransaction.amount : 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                {(() => {
                  const statusInfo = getStatusInfo(selectedTransaction.status)
                  const StatusIcon = statusInfo.icon
                  return (
                    <span className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color}`}>
                      <StatusIcon className={`h-4 w-4 ${statusInfo.iconColor}`} />
                      <span>{statusInfo.label}</span>
                    </span>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentHistory

