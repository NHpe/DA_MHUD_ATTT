# Secure Chat App

Một ứng dụng trò chuyện bảo mật với tính năng mã hóa đầu cuối (E2EE), được xây dựng bằng React + Node.js + MongoDB.

## Tính năng nổi bật

- Đăng ký, đăng nhập với xác thực JWT (token lưu trong cookie HttpOnly)
- Quản lý bạn bè: gửi lời mời kết bạn, chấp nhận từ chối, tìm kiếm
- Tạo và tham gia nhiều cuộc trò chuyện (1-1 hoặc nhóm)
- Gửi và nhận tin nhắn văn bản, tập tin (có mã hóa AES-256)
- Thay đổi tên, ảnh đại diện, đổi mật khẩu
- Chỉnh sửa, xóa tin nhắn
- Tải file về khi nhấn vào tin nhắn dạng tập tin
- Cập nhật UI real-time sau khi gửi tin nhắn

## Công nghệ sử dụng

### Frontend (React + TypeScript)
- React Router DOM v6
- Context API (AuthProvider)
- Axios (có xử lý withCredentials)
- TailwindCSS (UI nhanh, responsive)

### Backend (Node.js + Express + MongoDB)
- Xác thực JWT qua cookie với `passport-jwt`
- Lưu trữ file sử dụng MongoDB GridFS
- Mã hóa AES-256-CBC với `crypto`
- Mô hình dữ liệu rõ ràng: User, Chat, Message, Friend
- Tách rõ middleware xác thực, định tuyến và xử lý logic
- Upload file qua `multer` và gửi về frontend với chuẩn MIME
- Mã hóa `chatKey` trước khi truyền về FE, tránh lộ khoá

## Bảo mật

- `chatKey` không lưu dưới dạng plaintext ở frontend
- Chỉ backend mới có quyền giải mã hoặc xử lý `chatKey`
- Cookie chứa token chỉ gửi qua HTTPS (HttpOnly)
- Xử lý đúng CORS + CSRF bằng cách kiểm soát `withCredentials`

## Hướng phát triển

- [ ] Realtime update (WebSocket hoặc Socket.IO)
- [ ] Chia sẻ hình ảnh trực tiếp
- [ ] Mã hóa đầu cuối đúng chuẩn (ECDH + AES)
- [ ] Chuyển qua việc sử dụng E2EE
