# Giỏ hàng TTG local

Nguồn: https://ttgshop.vn/cart. Khảo sát và kiểm chứng bằng Chrome DevTools MCP qua launcher profile chuyên dụng ngày 2026-10-08. Mẫu có 3 PC khác nhau, mỗi PC số lượng 1, bảo hành 36 tháng, tổng 134.940.000 VNĐ.

## Kết quả triển khai

- Route `/cart`, `/cart/`, `/cart/index.html`; header dùng đường dẫn local theo depth. Badge 3 chỉ trên giỏ.
- Reuse layout/header/footer/serviceBenefits/commitment, ảnh và thông báo demo; component hàng sản phẩm, bảng, người mua, tổng tiền, nhóm hành động nhận dữ liệu qua tham số.
- Messenger/Zalo được tách thành floatingContact dùng chung với chi tiết sản phẩm. Ảnh 3 sản phẩm giữ nguyên bytes nguồn; build offline. Không thêm thư viện browser/runtime.
- Responsive dưới 1280px; dưới 640px label đặt trên input. Giỏ cố định, nút nghiệp vụ dùng toast. Form không submit ra mạng; không lưu thông tin vào storage.

## Kiểm chứng

- 8 khối chính (header, tiêu đề, bảng, biểu mẫu, hai cột, bảng thông tin người mua, voucher) khớp x/y/width/height nguồn tại 1280, 1440, 1620 và 1920px: delta 0px. Xem cart-measurements.json.
- Chụp toàn trang và so pixel vùng bảng, biểu mẫu cùng toàn trang. Pixel khác biệt khi độ lệch lớn nhất của kênh RGB >25/255. Vùng bảng khác khoảng 0,12–0,16%; biểu mẫu khoảng 0,81–1,21%. Đây là phép đo ảnh, không phải tuyên bố phần trăm giao diện giống nhau.
- Mobile 390/768/1024: không tràn ngang; nhãn đơn giá/số lượng/thành tiền hiện; biểu mẫu một cột; ảnh nội dung/contacts/footer tải thành công. Ảnh menu lazy đang ẩn không tính là ảnh hỏng.
- Click 15 nút nghiệp vụ và submit: toast hiện, số lượng 1/1/1, số dòng 3, tổng 134.940.000 VNĐ; submit bị preventDefault. Không có XHR/fetch/WebSocket hoặc console error/warning.
- Nhập tên, voucher, tỉnh và chọn điều khoản hoạt động tại UI; reload trả về trường trống và mặc định; localStorage/sessionStorage không có key.
- Tab từ họ tên sang SĐT, Shift+Tab quay lại, outline 3px hiện; Enter chặn submit và hiện demo. Chi tiết sản phẩm vẫn có một header/footer/contact rail, ảnh liên hệ 45px desktop, badge ẩn.
- 41/41 tests đạt; kiểm tra đủ 9 trang và 256 file public, hosting lồng thư mục và alias giỏ. Snapshot/build/test/source không phát hành qua preview.

## Sai khác và giới hạn

Icon hành động dùng SVG local thay font icon nguồn, còn khác nhỏ về nét/vị trí. Nhãn và vị trí chữ nút trả góp qua thẻ chưa trùng pixel hoàn toàn. Header/footer và dịch vụ/cam kết dùng component chung hiện có; source đang có ảnh footer lỗi trong khi local giữ logo đã có. Mobile dùng responsive đã duyệt thay bố cục nguồn rộng 1220px. Không tuyên bố đạt 100% pixel.

CSS chung tăng theo màn responsive thứ chín. Ngưỡng kiểm tra cập nhật từ 70 lên 80 KiB raw và bổ sung giới hạn 18 KiB gzip; thực tế khoảng 74 KiB raw, 15,2 KiB gzip. Số chính xác nằm trong validation.json.

## Đối chiếu

Ảnh đầy đủ: docs/screenshots/cart-source-{width}.png và cart-local-{width}.png. Diff: cart-diff-{width}-{items,form,whole}.png. Kết quả số: cart-pixel-comparison.json. `node scripts/compare-cart.mjs` so lại capture trong thư mục Temp; không mở browser hoặc tác động giỏ nguồn.
