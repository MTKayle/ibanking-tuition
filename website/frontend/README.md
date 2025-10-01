# 🏦 iBanking - Hệ thống thanh toán học phí trực tuyến

Ứng dụng web ngân hàng dùng để thanh toán học phí, hỗ trợ thanh toán cho sinh viên khác bằng mã sinh viên. Ứng dụng được xây dựng với React + Vite + Tailwind CSS.

## ✨ Tính năng

### 🔐 Đăng nhập
- Đăng nhập bằng số tài khoản và mật khẩu
- Giao diện đăng nhập hiện đại, bắt mắt

### 📊 Trang chủ (Dashboard)
- Hiển thị tổng quan tài khoản
- Thống kê giao dịch
- Giao dịch gần đây
- Các thao tác nhanh

### 💳 Thanh toán học phí
- Thanh toán học phí cho bản thân
- Chọn học kỳ
- Hiển thị thông tin sinh viên
- Kiểm tra số dư
- Xác nhận thanh toán

### 👥 Thanh toán cho sinh viên khác
- Tìm kiếm sinh viên bằng mã sinh viên
- Hiển thị thông tin sinh viên được tìm thấy
- Nhập số tiền và nội dung thanh toán
- Xác nhận thanh toán

### 📜 Lịch sử giao dịch
- Danh sách tất cả giao dịch
- Bộ lọc theo loại, ngày, từ khóa
- Thống kê tổng hợp
- Xuất file CSV

## 🚀 Cài đặt và chạy

### Yêu cầu
- Node.js 16+ 
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Chạy ở môi trường development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🔑 Thông tin đăng nhập Demo

**Lưu ý:** Đây là ứng dụng demo, chỉ có frontend. Bạn có thể đăng nhập bằng bất kỳ số tài khoản và mật khẩu nào.

Ví dụ:
- Số tài khoản: `1234567890`
- Mật khẩu: `password`

## 👨‍🎓 Mã sinh viên Demo

Sử dụng các mã sinh viên sau để test tính năng thanh toán cho sinh viên khác:
- `SV202401111` - Trần Thị B
- `SV202401222` - Lê Văn C
- `SV202401333` - Phạm Thị D
- `SV202401444` - Hoàng Văn E

## 🛠️ Công nghệ sử dụng

- **React 18** - Framework UI
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Context API** - State management

## 📁 Cấu trúc thư mục

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # React components
│   │   └── Layout.jsx
│   ├── context/         # Context providers
│   │   └── AuthContext.jsx
│   ├── pages/          # Page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── PayTuition.jsx
│   │   ├── PayForOther.jsx
│   │   └── TransactionHistory.jsx
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Giao diện

- Thiết kế hiện đại, responsive
- Màu sắc chủ đạo: Blue & Indigo
- UI/UX thân thiện
- Animation mượt mà
- Hỗ trợ mobile

## 💾 Lưu trữ dữ liệu

Ứng dụng sử dụng `localStorage` để lưu trữ:
- Thông tin đăng nhập
- Lịch sử giao dịch
- Thông tin tài khoản

**Lưu ý:** Đây chỉ là frontend demo, dữ liệu sẽ bị xóa khi clear browser cache.

## 📝 License

MIT

## 👨‍💻 Author

Created with ❤️ using React + Vite + Tailwind CSS

