import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    studentId: '',
    password: ''
  })
  const [error, setError] = useState('')

  // Mock user data - trong thực tế sẽ gọi API
  const mockUsers = [
    { studentId: 'SV001', password: '123456', name: 'Nguyễn Văn A', balance: 5000000 },
    { studentId: 'SV002', password: '123456', name: 'Trần Thị B', balance: 3000000 },
    { studentId: 'SV003', password: '123456', name: 'Lê Văn C', balance: 7500000 }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const user = mockUsers.find(
      u => u.studentId === formData.studentId && u.password === formData.password
    )

    if (user) {
      onLogin(user)
    } else {
      setError('Mã sinh viên hoặc mật khẩu không đúng')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎓 Hệ Thống Thanh Toán Học Phí</h1>
          <p>Đăng nhập để tiếp tục sử dụng dịch vụ</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Mã Sinh Viên</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Nhập mã sinh viên"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật Khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-primary">
            Đăng Nhập
          </button>
        </form>

        <div className="login-info">
          <p><strong>Tài khoản demo:</strong></p>
          <p>• SV001 / 123456</p>
          <p>• SV002 / 123456</p>
          <p>• SV003 / 123456</p>
        </div>
      </div>
    </div>
  )
}

export default Login

