import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-container">
          <h2>🎓 Hệ Thống Thanh Toán</h2>
          <div className="nav-right">
            <span className="user-name">Xin chào, {user.name}</span>
            <button onClick={onLogout} className="btn-logout">
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="welcome-section">
          <h1>Chào mừng, {user.name}!</h1>
          <p>Mã sinh viên: <strong>{user.studentId}</strong></p>
        </div>

        <div className="balance-card">
          <h3>💳 Số dư tài khoản</h3>
          <div className="balance-amount">{formatCurrency(user.balance)}</div>
        </div>

        <div className="actions-grid">
          <div 
            className="action-card" 
            onClick={() => navigate('/payment')}
          >
            <div className="action-icon">💳</div>
            <h3>Thanh Toán Học Phí</h3>
            <p>Thanh toán học phí cho bản thân</p>
          </div>

          <div 
            className="action-card" 
            onClick={() => navigate('/pay-for-others')}
          >
            <div className="action-icon">🤝</div>
            <h3>Thanh Toán Hộ</h3>
            <p>Thanh toán học phí cho sinh viên khác</p>
          </div>
        </div>

        <div className="info-section">
          <h3>📋 Thông tin hữu ích</h3>
          <ul>
            <li>Học phí phải được thanh toán trước ngày 15 hàng tháng</li>
            <li>Bạn có thể thanh toán hộ cho sinh viên khác nếu cần</li>
            <li>Kiểm tra số dư trước khi thực hiện thanh toán</li>
            <li>Mọi giao dịch đều được lưu lại để đối chiếu</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

