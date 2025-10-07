import { useState } from 'react'
import { studentAPI, paymentAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CreditCard, AlertCircle, CheckCircle2, FileText, Search, UserCheck, Loader2 } from 'lucide-react'

const PayTuition = () => {
  const { user, addTransaction } = useAuth()
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [studentInfo, setStudentInfo] = useState(null)
  const [description, setDescription] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otp, setOtp] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isPaid, setIsPaid] = useState(false)
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false)

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
      setIsLoading(true)
      setIsPaid(false)
      const numericIdCandidate = String(studentId).match(/\d+/)?.[0]
      const lookupId = numericIdCandidate ? numericIdCandidate : studentId

      const res = await studentAPI.getById(lookupId)
      const mapped = {
        id: res.id,
        name: res.fullname,
        class: res.major,
        tuitionDue: res.tuitionfee,
        tuitionId: res.tuitionid,
        semester: 'Học kỳ hiện tại',
        dueDate: '—'
      }
      setStudentInfo(mapped)
      setDescription(`Học phí ${mapped.semester} - ${mapped.name} (${studentId})`)
      setError('')
    } catch (err) {
      setStudentInfo(null)
      // Check if error message indicates student already paid
      const errorMessage = err.message || err.toString()
      if (errorMessage.includes('already paid') || errorMessage.includes('Student already paid')) {
        setIsPaid(true)
        setError('Sinh viên này đã thanh toán học phí!')
      } else {
        setIsPaid(false)
        setError('Không tìm thấy sinh viên. Vui lòng kiểm tra lại mã hoặc thử lại sau!')
      }
    } finally {
      setIsLoading(false)
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

  const confirmPayment = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Send OTP to user's email
      const otpRequest = {
        toEmail: user.email,
        tuitionId: studentInfo.tuitionId,
        userId: user.id
      }
      
      await paymentAPI.sendOtp(otpRequest)
      
      // Show OTP input modal
      setShowConfirm(false)
      setShowOtpModal(true)
    } catch (err) {
      setError('Không thể gửi mã OTP. Vui lòng thử lại!')
      console.error('Send OTP error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const confirmOtpAndPay = async () => {
    if (!otp || otp.length !== 6) {
      setError('Vui lòng nhập mã OTP gồm 6 chữ số!')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      
      // Call payment API
      const paymentRequest = {
        studentid: studentInfo.id,
        payerid: user.id,
        tuitionid: studentInfo.tuitionId,
        amount: studentInfo.tuitionDue,
        otp: otp
      }
      
      const response = await paymentAPI.pay(paymentRequest)
      
      if (response.transactionId) {
        // Create local transaction record
        const transaction = {
          type: 'Thanh toán học phí',
          amount: studentInfo.tuitionDue,
          recipient: studentId,
          description: description
        }
        
        addTransaction(transaction)
        setShowOtpModal(false)
        setShowSuccess(true)
        
        setTimeout(() => {
          navigate('/history')
        }, 2000)
      } else {
        // Check if tuition is already paid
        const responseMessage = response.message || ''
        if (responseMessage.includes('Tuition is already paid') || responseMessage.includes('already paid')) {
          setError('❌ Sinh viên này đã thanh toán học phí rồi!')
          setShowOtpModal(false)
          setShowConfirm(false)
          setIsPaid(true)
        } else if (responseMessage.includes('Insufficient balance') || responseMessage.includes('không đủ')) {
          setShowOtpModal(false)
          setShowConfirm(false)
          setShowInsufficientBalance(true)
          
          // Refresh page after 2 seconds to update balance
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          setError(response.message || 'Thanh toán thất bại!')
        }
      }
    } catch (err) {
      const errorMessage = err.message || err.toString()
      
      // Check if error is about already paid tuition
      if (errorMessage.includes('Tuition is already paid') || errorMessage.includes('already paid')) {
        setError('❌ Sinh viên này đã thanh toán học phí rồi!')
        setShowOtpModal(false)
        setShowConfirm(false)
        setIsPaid(true)
      } else if (errorMessage.includes('Insufficient balance') || errorMessage.includes('không đủ')) {
        setShowOtpModal(false)
        setShowConfirm(false)
        setShowInsufficientBalance(true)
        
        // Refresh page after 2 seconds to update balance
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else if (errorMessage.includes('Invalid OTP') || errorMessage.includes('OTP')) {
        setError('Mã OTP không chính xác hoặc đã hết hạn. Vui lòng thử lại!')
      } else {
        setError('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!')
      }
      console.error('Payment error:', err)
    } finally {
      setIsLoading(false)
    }
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
                  setIsPaid(false)
                  setError('')
                }}
                placeholder="Nhập mã sinh viên (VD: SV202401234)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                  required
                />
              <button
                type="button"
                onClick={handleSearchStudent}
                disabled={isLoading}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Tra cứu'}
              </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 MSSV demo: SV202401111, SV202401222, SV202401234, SV202401333, SV202401444
              </p>
            </div>

            {/* Error Message */}
            {error && !studentInfo && !isPaid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Already Paid Message */}
            {isPaid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">❌ Sinh viên đã thanh toán học phí</p>
                  <p className="text-sm text-red-600 mt-1">
                    {studentId ? `Mã sinh viên ${studentId} đã hoàn tất thanh toán học phí cho học kỳ hiện tại.` : 'Học phí đã được thanh toán.'}
                  </p>
                  {studentInfo && (
                    <p className="text-sm text-red-600 mt-1">
                      Sinh viên: <span className="font-semibold">{studentInfo.name}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Student Info Display */}
            {studentInfo && !isPaid && (
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
            {studentInfo && !isPaid && (
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

            {studentInfo && !isPaid && studentInfo.tuitionDue > user?.balance && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Số dư không đủ</p>
                  <p className="text-sm text-red-600">Vui lòng nạp thêm tiền vào tài khoản để thanh toán.</p>
                </div>
              </div>
            )}

            {studentInfo && !isPaid && (
              <button
                type="submit"
                disabled={studentInfo.tuitionDue > user?.balance || isLoading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-200 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  'Thanh toán ngay'
                )}
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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowConfirm(false)
                  setError('')
                }}
                disabled={isLoading}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmPayment}
                disabled={isLoading}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang gửi OTP...
                  </>
                ) : (
                  'Xác nhận'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Xác thực OTP</h3>
            <p className="text-sm text-gray-600 mb-6">
              Mã OTP đã được gửi đến email: <span className="font-semibold">{user?.email}</span>
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập mã OTP (6 chữ số)
              </label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  setOtp(value)
                  setError('')
                }}
                placeholder="000000"
                className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowOtpModal(false)
                  setOtp('')
                  setError('')
                  setShowConfirm(true)
                }}
                disabled={isLoading}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={confirmOtpAndPay}
                disabled={isLoading || otp.length !== 6}
                className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Đang thanh toán...
                  </>
                ) : (
                  'Xác nhận thanh toán'
                )}
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

      {/* Insufficient Balance Modal */}
      {showInsufficientBalance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-scale-in">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">Số dư không đủ!</h3>
            <p className="text-gray-600 mb-4">Số dư tài khoản của bạn không đủ để thực hiện giao dịch này.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <Loader2 className="h-4 w-4 inline animate-spin mr-2" />
                Đang cập nhật số dư và tải lại trang...
              </p>
            </div>
            <p className="text-xs text-gray-500">Vui lòng kiểm tra số dư và thử lại</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayTuition
