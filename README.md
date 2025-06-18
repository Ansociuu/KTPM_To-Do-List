
# 📋 To-Do List Web App

## 🌐 Giới thiệu
Dự án **To-Do List Web App** là một ứng dụng web giúp người dùng quản lý công việc cá nhân và nhóm một cách hiệu quả, khoa học và dễ sử dụng. Ứng dụng hỗ trợ nhiều tính năng từ cơ bản đến nâng cao như tạo nhiệm vụ, phân loại, thống kê hiệu suất, làm việc nhóm, và hỗ trợ đa ngôn ngữ.
## Cấu trúc thư mục
📦 KTPM_To-Do-List
├── .vscode/                 # Cấu hình VSCode
├── IMAGES/                 # Chứa hình ảnh minh họa (demo, báo cáo, README...)
├── backend/                # Source code backend (NestJS + Prisma)
│   ├── src/                # Mã nguồn chính backend
│   ├── prisma/             # File schema.prisma và migration
│   └── .env                # Biến môi trường kết nối DB (không commit)
├── frontend/               # Source code giao diện người dùng
│   ├── index.html          # Giao diện chính
│   ├── css/                # Các file CSS
│   └── js/                 # Các file JavaScript
├── LICENSE                 # Giấy phép MIT
└── README.md               # Tài liệu mô tả dự án

## 🚀 Công nghệ sử dụng
- **Frontend**: HTML, CSS, JavaScript (thuần)
- **Backend**: NestJS (Node.js, TypeScript)
- **Cơ sở dữ liệu**: MySQL
- **ORM**: Prisma

## 📌 Chức năng chính
### Người dùng
- Đăng ký / Đăng nhập
- Quản lý nhiệm vụ (thêm, sửa, xóa, hoàn thành)
- Tìm kiếm và lọc nhiệm vụ
- Sử dụng template sẵn có
- Xem thống kê hiệu suất công việc
- Giao diện lịch và biểu đồ
- Tạo nhóm, tham gia nhóm
- Giao tiếp nhóm (chat)
- Quy đổi điểm thưởng

### Quản trị viên
- Quản lý người dùng
- Quản lý nhiệm vụ và template
- Truy xuất và thao tác dữ liệu

## 🛠 Cài đặt và chạy dự án

### 1. Clone repository
```bash
git clone https://github.com/Ansociuu/KTPM_To-Do-List.git
cd KTPM_To-Do-List


✅ Kiểm thử
Đã kiểm thử thành công các chức năng:

Đăng ký/đăng nhập

Thêm/sửa/xóa nhiệm vụ

Tìm kiếm & lọc

Tự động làm mới access token

Thống kê công việc

Giao diện responsive

📈 Hướng phát triển tương lai
Nhắc việc (reminder), thống kê theo thời gian

Tích hợp chat, phân quyền trong nhóm

PWA hoặc bản mobile app

Bảo mật nâng cao (2FA, mã hóa dữ liệu)

Tích hợp thông báo qua email / trình duyệt

🔗 Liên kết
📁 GitHub Repo

📄 Tài liệu tham khảo, W3Schools
