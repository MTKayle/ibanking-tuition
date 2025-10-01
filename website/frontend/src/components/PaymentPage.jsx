import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PaymentPage.css'

function PaymentPage({ user, onLogout }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    semester: '',
    amount: '',
    paymentMethod: 'bank'
  })
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)

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
    
    if (name === 'semester') {
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
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    // Giả lập xử lý thanh toán
    setTimeout(() => {
      setShowConfirm(false)
      setSuccess(true)
      
      // Redirect về dashboard sau 3 giây
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    }, 1500)
  }

  if (success) {
    return (
      <div className="payment-page">
        <nav className="navbar">
          <div className="nav-container">
            <h2>🎓 Hệ Thống Thanh Toán</h2>
            <button onClick={onLogout} className="btn-logout">Đăng xuất</button>
          </div>
        </nav>
        
        <div className="container">
          <div className="success-container">
            <div className="success-icon">✓</div>
            <h2>🎉 Thanh toán thành công!</h2>
            <p>Học phí học kỳ {formData.semester} đã được thanh toán</p>
            <p className="success-amount">{formatCurrency(formData.amount)}</p>
            <p className="redirect-text">⏱️ Đang chuyển về trang chủ...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="payment-page">
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
          <h2>💳 Thanh Toán Học Phí</h2>
          <p className="subtitle">Thanh toán học phí cho sinh viên: <strong>{user.name}</strong> ({user.studentId})</p>

          <form onSubmit={handleSubmit}>
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
              <span>Số dư hiện tại:</span>
              <span className="balance">{formatCurrency(user.balance)}</span>
            </div>

            <button type="submit" className="btn-primary">
              Xác nhận thanh toán
            </button>
          </form>
        </div>
      </div>

      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Xác nhận thanh toán</h3>
            <div className="confirm-details">
              <p><strong>Sinh viên:</strong> {user.name}</p>
              <p><strong>Mã SV:</strong> {user.studentId}</p>
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

export default PaymentPage

