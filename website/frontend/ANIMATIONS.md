# 🎨 Hiệu ứng và Animations

Tài liệu này mô tả tất cả các hiệu ứng animation được sử dụng trong ứng dụng iBanking.

## 🌟 Danh sách Animations

### 1. **Fade In** (`animate-fade-in`)
- **Mô tả**: Hiệu ứng xuất hiện mờ dần từ dưới lên
- **Thời gian**: 0.6s
- **Sử dụng tại**: Header, Cards, Sections

### 2. **Slide Up** (`animate-slide-up`)
- **Mô tả**: Trượt lên từ dưới khi xuất hiện
- **Thời gian**: 0.6s
- **Sử dụng tại**: Stats cards, Quick actions

### 3. **Slide In Right** (`animate-slide-in-right`)
- **Mô tả**: Trượt vào từ bên trái
- **Thời gian**: 0.4s
- **Sử dụng tại**: Transaction rows trong bảng

### 4. **Scale In** (`animate-scale-in`)
- **Mô tả**: Phóng to từ nhỏ lên bình thường
- **Thời gian**: 0.3s
- **Sử dụng tại**: Modals, Counters

### 5. **Blob Animation** (`animate-blob`)
- **Mô tả**: Chuyển động mềm mại như hình blob
- **Thời gian**: 7s (infinite)
- **Sử dụng tại**: Background decorations

### 6. **Bounce Slow** (`animate-bounce-slow`)
- **Mô tả**: Nhảy nhẹ nhàng
- **Thời gian**: 3s (infinite)
- **Sử dụng tại**: Logo, Icons

### 7. **Counter** (`animate-counter`)
- **Mô tả**: Hiệu ứng cho số đếm
- **Thời gian**: 0.5s
- **Sử dụng tại**: Statistics numbers

### 8. **Gradient Shift** (`animate-gradient`)
- **Mô tả**: Chuyển động gradient background
- **Thời gian**: 3s (infinite)
- **Sử dụng tại**: Special backgrounds

### 9. **Shimmer** (`animate-shimmer`)
- **Mô tả**: Hiệu ứng lấp lánh loading
- **Thời gian**: 2s (infinite)
- **Sử dụng tại**: Loading skeletons

## ⏱️ Animation Delays

- `animation-delay-150`: 150ms
- `animation-delay-200`: 200ms
- `animation-delay-300`: 300ms
- `animation-delay-400`: 400ms
- `animation-delay-2000`: 2s
- `animation-delay-4000`: 4s

## 📄 Trang Login

### Hiệu ứng:
- ✨ Animated background blobs
- ✨ Logo bounce animation
- ✨ Card slide up entrance
- ✨ Gradient button hover effect
- ✨ Smooth fade-in for all elements

### Đặc điểm:
- Background động với 3 blob di chuyển
- Logo nhảy nhẹ liên tục
- Form card trượt lên khi load
- Button gradient hover

## 📊 Trang Dashboard

### Hiệu ứng:
- ✨ Animated welcome banner with blob background
- ✨ Stats cards với stagger animation
- ✨ Quick actions hover scale
- ✨ Transactions list fade-in
- ✨ Counter animation cho số liệu

### Đặc điểm:
- Banner có background động
- Số dư hiển thị với counter effect
- Stats cards xuất hiện lần lượt (stagger)
- Quick action cards scale khi hover

## 📜 Trang Transaction History

### Hiệu ứng:
- ✨ Loading skeleton animation
- ✨ Header với animated gradient & blobs
- ✨ Stats cards với hover scale
- ✨ Collapsible filter với smooth transition
- ✨ Table rows slide-in stagger
- ✨ Transaction detail modal scale-in
- ✨ Export button gradient hover

### Đặc điểm:
- Loading state với skeleton shimmer
- Header background có blob animation
- Filter collapse/expand mượt mà
- Mỗi row xuất hiện lần lượt
- Click row để xem chi tiết với modal
- Hover effects trên tất cả elements

## 💳 Trang Thanh Toán

### Hiệu ứng:
- ✨ Form inputs focus animation
- ✨ Button hover effects
- ✨ Modal animations
- ✨ Success modal với scale-in

## 🎯 Hover Effects

### Cards:
```css
- Shadow elevation (shadow-md → shadow-xl)
- Scale transform (hover:scale-105)
- Gradient background shift
```

### Buttons:
```css
- Gradient color shift
- Scale animation (hover:scale-[1.02])
- Shadow enhancement
```

### Table Rows:
```css
- Background gradient (from-blue-50 to-indigo-50)
- Scale transform (hover:scale-[1.01])
- Smooth transitions (duration-300)
```

## 🎨 Transitions

Tất cả transitions sử dụng:
- **Duration**: 300ms (default)
- **Easing**: ease-out (cho entrance), ease-in-out (cho interactive)
- **Properties**: transform, opacity, colors, shadows

## 📱 Responsive Behavior

- Animations tắt khi `prefers-reduced-motion`
- Mobile có animations nhẹ hơn
- Loading states responsive

## 🔧 Custom CSS Classes

Tất cả custom animations được định nghĩa trong `src/index.css`:
- Keyframes cho các animations
- Utility classes
- Animation delays
- Special effects

## 💡 Best Practices

1. **Performance**: Sử dụng `transform` và `opacity` cho animations
2. **Timing**: Stagger delays để tạo hiệu ứng lần lượt
3. **Accessibility**: Respect `prefers-reduced-motion`
4. **User Experience**: Không quá nhiều animation cùng lúc

## 🎬 Animation Timeline

### Page Load:
1. Header (0ms)
2. Stats (100-200ms stagger)
3. Quick Actions (200-400ms stagger)
4. Recent Transactions (400ms)

### User Interactions:
- Hover: Instant
- Click: 200-300ms
- Modal: 300ms
- Page transition: 400ms

