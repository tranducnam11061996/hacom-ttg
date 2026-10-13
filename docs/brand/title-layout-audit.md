# Khung tiêu đề tự giãn theo chữ

Đã thay khung cố định Deal HOT bằng grid ba cột: ngọn lửa 57 px, thân chữ tự giãn, đầu nhọn 28 px. Ngọn lửa là vector gốc từ PDF, cao 84 px. Hai lớp polygon tạo viền trắng liên tục; gradient chạy xuyên toàn bộ thân và đầu nhọn. Padding chữ: trái 12 px, phải 20 px, dọc 14 px.

Tiêu đề danh mục dùng grid gồm thân chữ và đuôi 48 px. Padding chữ: trái 14 px, phải 20 px, dọc 12 px. Hai lớp đuôi chéo tách khỏi vùng chữ; không kéo toàn bộ ảnh nền theo độ dài tiêu đề.

Cả hai dùng fit-content, max-width 100%, min-width 0 và overflow-wrap anywhere. Khi hết chỗ, chữ xuống dòng và chiều cao khung tăng. Header danh mục cho phép wrap; trên mobile, Xem tất cả nằm hàng riêng để nhường chiều rộng cho tiêu đề.

## Kiểm tra

- Lint, typecheck và build đạt; git diff --check đạt.
- Kiểm tra 4 viewport × 4 loại nội dung × 2 cỡ chữ × 2 loại khung = **64 phép kiểm tra khung**. Chữ ngắn, dài, dài gấp đôi và chuỗi 130 ký tự không có khoảng trắng đều nằm trong vùng chữ, có padding phải 20 px; không tràn ngang.
- Cỡ chữ 200% được mô phỏng bằng tăng font-size và line-height trên hai nhãn; nội dung/style thử được khôi phục sau kiểm tra. Chi tiết: [title-layout-checks.json](title-layout-checks.json).
- Đối chiếu trực quan riêng PC WORKSTATION 2D 3D và DEAL HOT MỖI NGÀY. Không còn chữ sát/đè phần nhọn.
- Console không có lỗi JavaScript; có cảnh báo preload font chưa dùng ngay trong phiên thử thay nội dung/viewport, không liên quan đến kích thước khung.
- Thay đổi chỉ thuộc CSS nhãn, phần tử trang trí aria-hidden và SVG ngọn lửa; dữ liệu, banner và ảnh sản phẩm giữ nguyên.

[Ảnh desktop](pdf-style-screenshots/titles-desktop.png) · [Ảnh mobile](pdf-style-screenshots/titles-mobile.png).
