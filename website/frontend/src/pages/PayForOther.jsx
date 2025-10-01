import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Users, AlertCircle, CheckCircle2, FileText, Search, UserCheck } from 'lucide-react'

const PayForOther = () => {
  const { user, addTransaction } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    amount: '',
    description: ''
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [studentFound, setStudentFound] = useState(false)

  // Mock student database
  const mockStudents = {
    'SV202401111': 'Trần Thị B',
    'SV202401222': 'Lê Văn C',
    'SV202401333': 'Phạm Thị D',
    'SV202401444': 'Hoàng Văn E',
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleSearchStudent = () => {
    const studentName = mockStudents[formData.studentId]
    if (studentName) {
      setFormData(prev => ({ ...prev, studentName }))
      setStudentFound(true)
    } else {
      setFormData(prev => ({ ...prev, studentName: '' }))
      setStudentFound(false)
      alert('Không tìm thấy sinh viên với mã này!')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? value.replace(/\D/g, '') : value
    }))
    
    if (name === 'studentId') {
      setStudentFound(false)
      setFormData(prev => ({ ...prev, studentName: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!studentFound) {
      alert('Vui lòng tìm kiếm và xác nhận thông tin sinh viên trước khi thanh toán!')
      return
    }
    
    setShowConfirm(true)
  }

  const confirmPayment = () => {
    const transaction = {
      type: 'Thanh toán cho SV khác',
      amount: parseInt(formData.amount),
      recipient: formData.studentId,
      description: `${formData.description} - Thanh toán cho ${formData.studentName} (${formData.studentId})`
    }
    
    addTransaction(transaction)
    setShowConfirm(false)
    setShowSuccess(true)
    
    setTimeout(() => {
      navigate('/history')
    }, 2000)
  }

  const amountInt = parseInt(formData.amount) || 0

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Thanh toán cho sinh viên khác</h2>
              <p className="text-purple-100">Thanh toán học phí giúp sinh viên khác</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Your Account Info */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Tài khoản thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Chủ tài khoản:</span>
                <span className="ml-2 font-medium">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="ml-2 font-medium">{user?.accountNumber}</span>
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
            {/* Student ID Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Mã sinh viên người nhận</span>
                </div>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Nhập mã sinh viên (VD: SV202401111)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={handleSearchStudent}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Tìm kiếm
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 Mã SV demo: SV202401111, SV202401222, SV202401333, SV202401444
              </p>
            </div>

            {/* Student Name Display */}
            {studentFound && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Đã tìm thấy sinh viên</p>
                    <p className="text-sm text-green-700">
                      <span className="font-semibold">{formData.studentName}</span> - {formData.studentId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền thanh toán
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="amount"
                  value={formData.amount ? formatCurrency(parseInt(formData.amount)) : ''}
                  onChange={handleChange}
                  placeholder="Nhập số tiền"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  required
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
                placeholder="Nhập nội dung thanh toán (VD: Học phí học kỳ 1 năm 2025)"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                required
              />
            </div>

            {amountInt > user?.balance && (
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
              disabled={amountInt > user?.balance || !studentFound}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                <span className="text-gray-600">Người nhận:</span>
                <span className="font-medium">{formData.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mã SV:</span>
                <span className="font-medium">{formData.studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-primary-600">{formatCurrency(amountInt)}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="text-gray-600">Nội dung:</span>
                <p className="text-sm mt-1">{formData.description}</p>
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
                className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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

export default PayForOther

