import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PayForOthers.css'

function PayForOthers({ user, onLogout }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    beneficiaryId: '',
    beneficiaryName: '',
    semester: '',
    amount: '',
    paymentMethod: 'bank'
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Mock data sinh viên
  const mockStudents = {
    'SV001': 'Nguyễn Văn A',
    'SV002': 'Trần Thị B',
    'SV003': 'Lê Văn C',
    'SV004': 'Phạm Thị D',
    'SV005': 'Hoàng Văn E'
  }

  const tuitionFees = {
    '2024-1': 8000000,
    '2024-2': 8000000,
    '2024-3': 4000000
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setError('')
    
    if (name === 'beneficiaryId') {
      const studentName = mockStudents[value] || ''
      setFormData({
        ...formData,
        beneficiaryId: value,
        beneficiaryName: studentName
      })
    } else if (name === 'semester') {
      setFormData({
        ...formData,
        semester: value,
        amount: tuitionFees[value] || ''
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.beneficiaryId === user.studentId) {
      setError('Không thể thanh toán hộ cho chính mình. Vui lòng sử dụng tính năng "Thanh Toán Học Phí"')
      return
    }

    if (!formData.beneficiaryName) {
      setError('Mã sinh viên không tồn tại trong hệ thống')
      return
    }

    if (formData.amount > user.balance) {
      setError('Số dư không đủ để thực hiện giao dịch')
      return
    }

    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setTimeout(() => {
      setShowConfirm(false)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    }, 1500)
  }

  if (success) {
    return (
      <div className="pay-for-others-page">
        <nav className="navbar">
          <div className="nav-container">
            <h2>🎓 Hệ Thống Thanh Toán</h2>
            <button onClick={onLogout} className="btn-logout">Đăng xuất</button>
          </div>
        </nav>
        
        <div className="container">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>🎉 Thanh toán hộ thành công!</h2>
            <p>Bạn đã thanh toán học phí cho sinh viên</p>
            <p className="beneficiary-name">{formData.beneficiaryName} ({formData.beneficiaryId})</p>
            <p className="success-amount">{formatCurrency(formData.amount)}</p>
            <p className="redirect-text">⏱️ Đang chuyển về trang chủ...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pay-for-others-page">
      <nav className="navbar">
        <div className="nav-container">
          <h2>🎓 Hệ Thống Thanh Toán</h2>
          <div className="nav-right">
            <span className="user-name">{user.name}</span>
            <button onClick={onLogout} className="btn-logout">Đăng xuất</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Quay lại
        </button>

        <div className="payment-card">
          <h2>🤝 Thanh Toán Hộ Sinh Viên Khác</h2>
          <p className="subtitle">Người thanh toán: <strong>{user.name}</strong> ({user.studentId})</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="beneficiaryId">Mã Sinh Viên Được Thanh Toán Hộ</label>
              <input
                type="text"
                id="beneficiaryId"
                name="beneficiaryId"
                value={formData.beneficiaryId}
                onChange={handleChange}
                placeholder="Nhập mã sinh viên"
                required
              />
              {formData.beneficiaryName && (
                <p className="student-name">Tên: {formData.beneficiaryName}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="semester">Học Kỳ</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">Chọn học kỳ</option>
                <option value="2024-1">Học kỳ 1 năm 2024 (8,000,000đ)</option>
                <option value="2024-2">Học kỳ 2 năm 2024 (8,000,000đ)</option>
                <option value="2024-3">Học kỳ hè năm 2024 (4,000,000đ)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount">Số Tiền</label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount ? formatCurrency(formData.amount) : ''}
                readOnly
                placeholder="Chọn học kỳ để hiển thị số tiền"
              />
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod">Phương Thức Thanh Toán</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
              >
                <option value="bank">Chuyển khoản ngân hàng</option>
                <option value="ewallet">Ví điện tử</option>
                <option value="card">Thẻ tín dụng/ghi nợ</option>
              </select>
            </div>

            <div className="balance-info">
              <span>Số dư của bạn:</span>
              <span className="balance">{formatCurrency(user.balance)}</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-primary">
              Xác nhận thanh toán hộ
            </button>
          </form>

          <div className="info-box">
            <p><strong>💡 Lưu ý:</strong></p>
            <ul>
              <li>Bạn sẽ thanh toán học phí cho sinh viên khác</li>
              <li>Số tiền sẽ được trừ từ tài khoản của bạn</li>
              <li>Giao dịch không thể hoàn tác sau khi xác nhận</li>
            </ul>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận thanh toán hộ</h3>
            <div className="confirm-details">
              <p><strong>Người thanh toán:</strong> {user.name} ({user.studentId})</p>
              <p><strong>Thanh toán cho:</strong> {formData.beneficiaryName} ({formData.beneficiaryId})</p>
              <p><strong>Học kỳ:</strong> {formData.semester}</p>
              <p><strong>Số tiền:</strong> {formatCurrency(formData.amount)}</p>
              <p><strong>Phương thức:</strong> {
                formData.paymentMethod === 'bank' ? 'Chuyển khoản ngân hàng' :
                formData.paymentMethod === 'ewallet' ? 'Ví điện tử' : 'Thẻ tín dụng/ghi nợ'
              }</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowConfirm(false)} className="btn-secondary">
                Hủy
              </button>
              <button onClick={handleConfirm} className="btn-primary">
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PayForOthers

