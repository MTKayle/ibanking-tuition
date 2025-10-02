import { useState } from 'react'
import { studentAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CreditCard, AlertCircle, CheckCircle2, FileText, Search, UserCheck } from 'lucide-react'

const PayTuition = () => {
  const { user, addTransaction } = useAuth()
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [studentInfo, setStudentInfo] = useState(null)
  const [description, setDescription] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Dữ liệu sẽ lấy từ API student-service

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleSearchStudent = async () => {
    if (!studentId) return

    try {
      const numericIdCandidate = String(studentId).match(/\d+/)?.[0]
      const lookupId = numericIdCandidate ? numericIdCandidate : studentId

      const res = await studentAPI.getById(lookupId)
      const mapped = {
        name: res.fullname,
        class: res.major,
        tuitionDue: res.tuitionfee,
        semester: 'Học kỳ hiện tại',
        dueDate: '—'
      }
      setStudentInfo(mapped)
      setDescription(`Học phí ${mapped.semester} - ${mapped.name} (${studentId})`)
    } catch (err) {
      setStudentInfo(null)
      alert('Không tìm thấy sinh viên. Vui lòng kiểm tra lại mã hoặc thử lại sau!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!studentInfo) {
      alert('Vui lòng tìm kiếm và xác nhận thông tin sinh viên trước khi thanh toán!')
      return
    }
    
    setShowConfirm(true)
  }

  const confirmPayment = () => {
    const transaction = {
      type: 'Thanh toán học phí',
      amount: studentInfo.tuitionDue,
      recipient: studentId,
      description: description
    }
    
    addTransaction(transaction)
    setShowConfirm(false)
    setShowSuccess(true)
    
    setTimeout(() => {
      navigate('/history')
    }, 2000)
  }

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
              <p className="text-blue-100">Tra cứu và thanh toán học phí sinh viên</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Bank Account Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
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

          {/* Student ID Search */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Mã số sinh viên</span>
                </div>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => {
                    setStudentId(e.target.value)
                    setStudentInfo(null)
                  }}
                  placeholder="Nhập mã sinh viên (VD: SV202401234)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  required
                />
                <button
                  type="button"
                  onClick={handleSearchStudent}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Tra cứu
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 MSSV demo: SV202401111, SV202401222, SV202401234, SV202401333, SV202401444
              </p>
            </div>

            {/* Student Info Display */}
            {studentInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <UserCheck className="h-6 w-6 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-3">Thông tin sinh viên và học phí</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Họ và tên:</span>
                        <span className="ml-2 font-semibold text-gray-800">{studentInfo.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mã SV:</span>
                        <span className="ml-2 font-semibold text-gray-800">{studentId}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Lớp:</span>
                        <span className="ml-2 font-semibold text-gray-800">{studentInfo.class}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Học kỳ:</span>
                        <span className="ml-2 font-semibold text-gray-800">{studentInfo.semester}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hạn nộp:</span>
                        <span className="ml-2 font-semibold text-red-600">{studentInfo.dueDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Học phí:</span>
                        <span className="ml-2 font-bold text-primary-600 text-lg">
                          {formatCurrency(studentInfo.tuitionDue)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {studentInfo && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Nội dung thanh toán</span>
                  </div>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  required
                />
              </div>
            )}

            {studentInfo && studentInfo.tuitionDue > user?.balance && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Số dư không đủ</p>
                  <p className="text-sm text-red-600">Vui lòng nạp thêm tiền vào tài khoản để thanh toán.</p>
                </div>
              </div>
            )}

            {studentInfo && (
              <button
                type="submit"
                disabled={studentInfo.tuitionDue > user?.balance}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Thanh toán ngay
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && studentInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Xác nhận thanh toán học phí</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sinh viên:</span>
                <span className="font-medium">{studentInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mã SV:</span>
                <span className="font-medium">{studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Học kỳ:</span>
                <span className="font-medium">{studentInfo.semester}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Học phí:</span>
                <span className="font-bold text-primary-600">{formatCurrency(studentInfo.tuitionDue)}</span>
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
