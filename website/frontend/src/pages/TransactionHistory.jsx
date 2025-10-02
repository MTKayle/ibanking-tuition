import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  History, 
  CheckCircle, 
  AlertTriangle, 
  Filter,
  Download,
  Calendar,
  Search,
  TrendingUp,
  FileText,
  Receipt,
  Sparkles
} from 'lucide-react'

const TransactionHistory = () => {
  const { transactions } = useAuth()
  const [filterType, setFilterType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type.includes(filterType)
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || transaction.date.includes(dateFilter)
    
    return matchesType && matchesSearch && matchesDate
  })

  // Calculate statistics
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
  const successCount = filteredTransactions.filter(t => t.status === 'Thành công').length

  const handleExport = () => {
    const csvContent = [
      ['Mã GD', 'Ngày', 'Loại', 'Số tiền', 'Người nhận', 'Mô tả', 'Trạng thái'],
      ...filteredTransactions.map(t => [
        t.id,
        t.date,
        t.type,
        t.amount,
        t.recipient,
        t.description,
        t.status
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `lich-su-giao-dich-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gray-200 rounded-2xl h-48"></div>
        <div className="bg-gray-200 rounded-xl h-40"></div>
        <div className="bg-gray-200 rounded-xl h-96"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with animated gradient */}
      <div className="bg-gradient-to-r from-green-600 via-teal-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden animate-fade-in">
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
              <h2 className="text-3xl font-bold">Lịch sử giao dịch</h2>
              <p className="text-green-100 text-sm mt-1">Theo dõi và quản lý các giao dịch của bạn</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm">Tổng giao dịch</p>
                <FileText className="h-5 w-5 text-green-200" />
              </div>
              <p className="text-3xl font-bold animate-counter">{filteredTransactions.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-150">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm">Thành công</p>
                <CheckCircle className="h-5 w-5 text-green-200" />
              </div>
              <p className="text-3xl font-bold animate-counter">{successCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 transform hover:scale-105 transition-all duration-300 animate-slide-up animation-delay-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-green-100 text-sm">Tổng tiền</p>
                <TrendingUp className="h-5 w-5 text-green-200" />
              </div>
              <p className="text-2xl font-bold animate-counter">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters with collapse animation */}
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
                  placeholder="Tìm theo mô tả, người nhận..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300"
                />
              </div>

              {/* Type Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <Receipt className="h-4 w-4 group-hover:text-primary-600 transition-colors" />
                    <span>Loại giao dịch</span>
                  </div>
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all hover:border-primary-300"
                >
                  <option value="all">Tất cả</option>
                  <option value="Thanh toán học phí">Thanh toán học phí</option>
                  <option value="cho SV khác">Thanh toán cho SV khác</option>
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
                  setFilterType('all')
                  setSearchTerm('')
                  setDateFilter('')
                }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-all hover:scale-105"
              >
                🔄 Xóa bộ lọc
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Download className="h-4 w-4" />
                <span>Xuất CSV</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction List with animations */}
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
                    Loại
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Người nhận
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Mô tả
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
                {filteredTransactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    onClick={() => setSelectedTransaction(transaction)}
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] animate-slide-in-right"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">{transaction.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{transaction.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type.includes('học phí') 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                        {transaction.recipient}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <span className="text-sm text-gray-600 line-clamp-2">{transaction.description}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                        -{formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-110 ${
                        transaction.status === 'Thành công'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}>
                        {transaction.status === 'Thành công' ? (
                          <CheckCircle className="h-3.5 w-3.5" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5" />
                        )}
                        <span>{transaction.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center animate-fade-in">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <History className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Không có giao dịch</h3>
            <p className="text-gray-500">Không tìm thấy giao dịch nào phù hợp với bộ lọc của bạn.</p>
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
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Mã giao dịch:</span>
                <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded">{selectedTransaction.id}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Ngày thực hiện:</span>
                <span className="font-medium text-gray-900">{selectedTransaction.date}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Loại giao dịch:</span>
                <span className="font-medium text-primary-600">{selectedTransaction.type}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Người nhận:</span>
                <span className="font-semibold text-gray-900">{selectedTransaction.recipient}</span>
              </div>
              <div className="pb-4 border-b">
                <span className="text-gray-600 block mb-2">Nội dung:</span>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedTransaction.description}</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-2xl text-red-600">-{formatCurrency(selectedTransaction.amount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`inline-flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedTransaction.status === 'Thành công'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedTransaction.status === 'Thành công' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  <span>{selectedTransaction.status}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionHistory
