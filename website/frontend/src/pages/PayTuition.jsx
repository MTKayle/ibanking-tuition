import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CreditCard, AlertCircle, CheckCircle2, Calendar, FileText } from 'lucide-react'

const PayTuition = () => {
  const { user, addTransaction } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    semester: 'HK1-2025',
    amount: 15000000,
    description: 'Học phí học kỳ 1 năm 2025'
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const confirmPayment = () => {
    const transaction = {
      type: 'Thanh toán học phí',
      amount: formData.amount,
      recipient: user.studentId,
      description: formData.description
    }
    
    addTransaction(transaction)
    setShowConfirm(false)
    setShowSuccess(true)
    
    setTimeout(() => {
      navigate('/history')
    }, 2000)
  }

  const tuitionOptions = [
    { value: 'HK1-2025', label: 'Học kỳ 1 - Năm 2025', amount: 15000000 },
    { value: 'HK2-2025', label: 'Học kỳ 2 - Năm 2025', amount: 15000000 },
    { value: 'HK3-2025', label: 'Học kỳ hè - Năm 2025', amount: 8000000 },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Thanh toán học phí</h2>
              <p className="text-blue-100">Thanh toán học phí cho bản thân</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* User Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Thông tin sinh viên</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Họ và tên:</span>
                <span className="ml-2 font-medium">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Mã sinh viên:</span>
                <span className="ml-2 font-medium">{user?.studentId}</span>
              </div>
              <div>
                <span className="text-gray-600">Số dư khả dụng:</span>
                <span className="ml-2 font-semibold text-primary-600">
                  {formatCurrency(user?.balance)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Chọn học kỳ</span>
                </div>
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={(e) => {
                  const selected = tuitionOptions.find(opt => opt.value === e.target.value)
                  setFormData({
                    semester: e.target.value,
                    amount: selected?.amount || 0,
                    description: `Học phí ${selected?.label}`
                  })
                }}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              >
                {tuitionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {formatCurrency(option.amount)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền thanh toán
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="amount"
                  value={formatCurrency(formData.amount)}
                  readOnly
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Nội dung thanh toán</span>
                </div>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              />
            </div>

            {formData.amount > user?.balance && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Số dư không đủ</p>
                  <p className="text-sm text-red-600">Vui lòng nạp thêm tiền vào tài khoản để thanh toán.</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={formData.amount > user?.balance}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Thanh toán ngay
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận thanh toán</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Học kỳ:</span>
                <span className="font-medium">
                  {tuitionOptions.find(opt => opt.value === formData.semester)?.label}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-primary-600">{formatCurrency(formData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Người nhận:</span>
                <span className="font-medium">{user?.studentId}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h3>
            <p className="text-gray-600 mb-4">Giao dịch của bạn đã được xử lý thành công.</p>
            <p className="text-sm text-gray-500">Đang chuyển đến lịch sử giao dịch...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayTuition

