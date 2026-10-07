# Đồng bộ icon header — 07/10/2026

Nguồn đối chiếu: https://ttgshop.vn/, Chrome DevTools profile riêng, zoom 100%, DPR 1. Thay bảy SVG mô phỏng bằng sprite PNG nguồn 452 × 406, background-size 226 × 203; dùng nguyên SVG gamepad nguồn. Build dùng tài nguyên local.

## Thay đổi và số đo

| Hạng mục | Trước | Sau / nguồn |
|---|---|---|
| Icon | SVG mô phỏng 18–24 px | Sprite đúng tọa độ, 14–24 px |
| Top line-height | 22,5 px màn hình lớn | 16 px |
| Input line-height / padding phải lớn | 22,5 / 68 px | 20 / 60 px |
| Khoảng cách menu → shortcut | 24 px cố định | Phân phối đều như nguồn |
| Hotline margin trái | Toàn nút | Vòng icon −18 px |
| Nhóm chức năng | Width cố định | Chiều rộng tự nhiên |
| Header 1280 / 1440 | — | 177,5 px |
| Header 1620 / 1920 | 195,5 px | 195,5 px |
| Search desktop nhỏ / lớn | — | 455 × 38 / 720 × 44 px |
| Nhóm chức năng nhỏ / lớn | 409,925 / 496,913 px | 409,938 / 496,922 px |
| Menu đầy đủ nhỏ / lớn | 195,609 / 229,578 px sau thay icon | 191,609 × 32 / 229,578 × 36 px |
| Menu thu gọn 1920 | — | 237,578 × 40 px; x152,5 y20, trùng nguồn |

Header đầy đủ tại 1920: shortcut PC Gaming x443,219; Workstation x630,594; AMD x914,641; Mini x1141,047; Văn phòng x1299,875; AI x1516,813. Các vị trí này trùng số đo nguồn trong phiên kiểm tra. Không tuyên bố toàn bộ pixel của mọi trạng thái hover đều đã đạt sai lệch dưới 1 px.

## Kiểm tra

- Lưu 16 ảnh source/local, full/compact tại 1280, 1440, 1620, 1920 trong `docs/screenshots/header-icons-*.jpg`.
- Kiểm tra viewport thực bằng emulation: 360, 390, 768, 1279 không tràn ngang trang. Mobile giữ bố cục responsive riêng, không sao chép chiều rộng tối thiểu nguồn.
- Build, tests, kiểm tra đường dẫn và HTTP đạt; 155 tài nguyên public, 0 lỗi HTTP. CSS 40.098 byte, UI JS gzip 5.396 byte.
- Giữ 171 vị trí sản phẩm, 84 vị trí Deal HOT, 82 video snapshot. Không sửa controller menu, carousel, player hoặc chức năng demo.
- Kiểm thử menu hiện có bao phủ hover, touch, Escape, focus, resize và ARIA. Ảnh chụp ghi lại trạng thái đầy đủ/thu gọn; chưa thực hiện so sánh pixel tự động cho tất cả trạng thái hover và focus.
