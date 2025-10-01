# 🎓 Hệ Thống Thanh Toán Học Phí

Ứng dụng web thanh toán học phí được xây dựng bằng React với **Glass Morphism Design** - giao diện cực kỳ đẹp và sáng tạo!

## ✨ Tính năng

- 🔐 **Đăng nhập**: Xác thực sinh viên với giao diện glass morphism
- 💳 **Thanh toán học phí**: Thanh toán học phí cho bản thân
- 🤝 **Thanh toán hộ**: Thanh toán học phí cho sinh viên khác
- 📊 **Quản lý số dư**: Hiển thị số dư với gradient card
- 🎨 **UI/UX Đỉnh cao**: Giao diện đẹp xuất sắc với:
  - ✨ **Glass Morphism** - hiệu ứng kính mờ hiện đại
  - 🌈 **Multi-layer Gradients** - gradient đa lớp tuyệt đẹp
  - 💫 **Advanced Animations** - animations tinh tế, mượt mà
  - 🎯 **Backdrop Blur Effects** - hiệu ứng blur chuyên nghiệp
  - 🔮 **Floating Elements** - phần tử lơ lửng động
  - 📱 **Fully Responsive** - hoàn hảo trên mọi thiết bị
  - 🎭 **Poppins & Space Grotesk Fonts** - typography cao cấp
  - 🌊 **Ripple Effects** - hiệu ứng sóng khi click
  - ⚡ **Smooth Transitions** - chuyển động siêu mượt

## 🚀 Cài đặt

### Yêu cầu
- Node.js 16+ 
- npm hoặc yarn

### Các bước cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng ở môi trường development:
```bash
npm run dev
```

3. Mở trình duyệt và truy cập: `http://localhost:5173`

## 🔑 Tài khoản demo

Bạn có thể đăng nhập bằng một trong các tài khoản sau:

- **Tài khoản 1**: SV001 / 123456 (Số dư: 5,000,000đ)
- **Tài khoản 2**: SV002 / 123456 (Số dư: 3,000,000đ)
- **Tài khoản 3**: SV003 / 123456 (Số dư: 7,500,000đ)

## 📁 Cấu trúc dự án

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Trang đăng nhập
│   │   ├── Login.css
│   │   ├── Dashboard.jsx      # Trang chủ sau đăng nhập
│   │   ├── Dashboard.css
│   │   ├── PaymentPage.jsx    # Trang thanh toán học phí
│   │   ├── PaymentPage.css
│   │   ├── PayForOthers.jsx   # Trang thanh toán hộ
│   │   └── PayForOthers.css
│   ├── App.jsx                # Component chính
│   ├── App.css
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Công nghệ sử dụng

- **React 18**: Library UI hiện đại
- **React Router DOM**: Client-side routing
- **Vite**: Build tool siêu nhanh
- **CSS3 Advanced**: Styling cao cấp với:
  - 🎨 **Glass Morphism** - backdrop-filter & blur effects
  - 🌈 **CSS Variables** - design system hoàn chỉnh
  - 🎯 **CSS Grid & Flexbox** - layout linh hoạt
  - 💫 **Keyframe Animations** - animations phức tạp
  - 🔮 **Backdrop Filters** - hiệu ứng kính mờ
  - 🎭 **Radial Gradients** - gradient đa chiều
  - 📐 **Custom Properties** - theming động
  - 🌊 **SVG Patterns** - pattern động
- **Poppins & Space Grotesk Fonts**: Typography cao cấp từ Google Fonts

## 💡 Hướng dẫn sử dụng

### Đăng nhập
1. Truy cập trang chủ
2. Nhập mã sinh viên và mật khẩu
3. Nhấn "Đăng nhập"

### Thanh toán học phí
1. Từ Dashboard, chọn "Thanh Toán Học Phí"
2. Chọn học kỳ cần thanh toán
3. Chọn phương thức thanh toán
4. Xác nhận và hoàn tất thanh toán

### Thanh toán hộ sinh viên khác
1. Từ Dashboard, chọn "Thanh Toán Hộ"
2. Nhập mã sinh viên cần thanh toán hộ
3. Chọn học kỳ và phương thức thanh toán
4. Xác nhận và hoàn tất thanh toán

## 📝 Lưu ý

- Đây là ứng dụng **frontend only**, không có backend thực tế
- Dữ liệu được lưu trữ tạm thời trong state (sẽ mất khi refresh)
- Các giao dịch thanh toán chỉ là simulation

## 🎯 Phát triển tiếp

Để tích hợp backend thực tế, bạn có thể:
- Thay thế mock data bằng API calls
- Thêm authentication với JWT
- Kết nối với database thực tế
- Thêm payment gateway integration

## 📄 License

MIT License

cmd /c npm run dev