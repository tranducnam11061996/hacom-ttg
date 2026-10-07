# Báo cáo triển khai — 07/10/2026

Đã viết lại website thành HTML tĩnh + Tailwind CSS 4.3.0 được build bằng CLI. Không có framework runtime, jQuery, Swiper, Hura, Fancybox, tracking hoặc ứng dụng iframe cũ. JavaScript thuần phụ trách menu/tab/slider, thông báo demo và player YouTube. Nội dung cửa hàng lấy từ snapshot bản local; kiểm tra thứ tự tên và giá của toàn bộ 171 vị trí.

## Dung lượng

| Hạng mục | File trước HTTP | Gzip HTTP |
|---|---:|---:|
| HTML gốc | 912.001 byte | Không đo bản gốc |
| HTML mới | 343.384 byte | 21.579 byte |
| Tailwind CSS | 20.517 byte | 5.286 byte |
| JS cửa hàng | 4.084 byte | 1.384 byte |
| JS player + chọn ID | 4.236 byte | 1.685 byte |

HTML giảm **62,3%**. CSS thấp hơn mục tiêu 70 KB; own JS thấp hơn mục tiêu 20 KB gzip/trang. Kích thước gzip trong bảng được đối chiếu Content-Length của server HTTP; không gồm HTTP headers hoặc mã YouTube bên ngoài.

Một lần reload desktop 1.440 × 900 px trong Browser Codex, cache trình duyệt đã ấm: 24 request local trong 3 giây đầu, tổng response body **1.165.562 byte**. Nhật ký chi tiết trong `http-observed.json`. Số này chỉ tính dữ liệu local thực sự server trả trong cửa sổ quan sát; không cộng thumbnail YouTube bên ngoài, không đại diện cold-cache/mobile hoặc dung lượng cả thư mục. Hero có autoplay và ảnh lazy nên lượng tải tiếp theo thay đổi theo thời gian/tương tác.

## Kiểm tra đã thực hiện

- Build đầy đủ, kiểm tra tham chiếu local/CSS/fonts, ID trùng và dấu vết code cũ: đạt. 6 trang HTML.
- 171 vị trí sản phẩm; 7 nhóm sản phẩm, 6 collection. Tên và giá đối chiếu snapshot theo thứ tự: đạt.
- Kiểm tra HTTP tất cả file phát hành và đối chiếu response với nội dung file: xem `http-validation.json`.
- Browser Codex: homepage và playlist ở 360, 390, 768, 1.280, 1.440, 1.920 px không tràn ngang toàn trang. Dải sản phẩm tương ứng 2/3/5/6 thẻ. ScrollWidth có thể nhỏ hơn viewport 15 px do thanh cuộn dọc.
- Tab click + phím ArrowRight; menu mobile mở và Escape đóng; nút tài khoản hiển thị demo; console trang chủ/player không có lỗi JS mới tại thời điểm kiểm tra.
- Player đã phát video thực. Chọn tập cập nhật URL/tiêu đề/tập đang chọn; reload giữ đúng tập; ID sai trở về đầu. Điều khiển Video tiếp theo trong YouTube cập nhật tiêu đề/URL bên ngoài sau khi video mới tải.
- 2 test Node: whitelist query và bảo toàn thứ tự/ID/tiêu đề của HTML playlist, giới hạn <=30. Đạt.
- npm audit: 0 vulnerability. Dependency build không được phát hành lên website.

## YouTube và giới hạn

4 playlist, **82 tập**: Siêu Trung Thực 2, Vlog 20, Aba Reaction 30, Daily Moment 30. Vlog tổng hiển thị 23 nhưng chỉ quan sát được 20 thẻ công khai khi cuộn tới cuối; không suy đoán 3 tập còn lại. Daily Moment dùng tổng 2.443 trên trang chi tiết. Snapshot không đồng bộ runtime.

Player chỉ tải khi bấm phát, homepage không tải iframe/IFrame API. Có full playlist ID và liên kết xem YouTube dự phòng. Video bên ngoài snapshot hiển thị tên chung để tránh gán nhầm. Khả năng nhúng có thể thay đổi theo quyền chủ kênh/đăng nhập/mạng.

**Chưa đo Lighthouse, LCP hoặc CLS.** Chrome DevTools MCP không kết nối được; Browser Codex cho phép kiểm tra giao diện nhưng không cung cấp phiên đo Lighthouse/Performance trace. Ngưỡng Performance >=90 desktop/>=85 mobile và CLS <=0,1 vẫn là mục tiêu chưa được xác nhận. Cần đo cold-cache trên môi trường hosting thật với cấu hình thiết bị/mạng ghi rõ.

Bản backup ZIP ngoài root đã được kiểm tra có 132 entry, trong đó index.html gốc đúng 912.001 byte. include chỉ được bỏ sau khi kiểm tra toàn bộ tham chiếu. README ghi cách chạy, chỉnh sửa, build lại, phát hành và phục hồi.

Thư mục include cũ đã được chuyển nguyên trạng ra D:\hacom-ttg-original-assets-2026-10-07 sau khi 120 file public vượt kiểm tra HTTP. Kiểm soát tự động chặn xóa đệ quy, không cung cấp lý do chi tiết; việc chuyển ra ngoài root giữ khả năng phục hồi.


