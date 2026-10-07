# Khối Deal HOT mỗi ngày

Đã thay giao diện Hot Sale bằng ảnh tiêu đề và nền local theo TTG Shop, thẻ sản phẩm đồng bộ với bảy section danh mục, mũi tên ở hai mép và nút Xem tất cả ở giữa footer. Chọn nhóm ở bên phải desktop và hàng riêng trên mobile.

Giữ sáu collection, 84 vị trí sale và 171 vị trí toàn trang; dữ liệu tên, ảnh, giá, giảm giá, trạng thái và thứ tự được kiểm tra theo snapshot. Hero và 82 tập YouTube không thay đổi. Link và mua hàng vẫn demo.

Ảnh tiêu đề được khôi phục từ backup local; kích thước thực 1376 × 150 px, hiển thị desktop 688 × 75 px. Đã cập nhật metadata và assets-map. Không tải ảnh thay thế sản phẩm.

## Điều khiển

Tái sử dụng controller một thẻ, autoplay 3500 ms, chuyển ease 1000 ms, rewind và không clone thẻ. Nhóm ẩn không autoplay. Chọn nhóm đưa track về đầu; bộ chọn đóng và trả focus về nút với tên nhóm đang chọn. Arrow/Home/End và Escape hoạt động. Bổ sung kéo chuột riêng cho sale, chặn click sau kéo; touch dùng cuộn native. Pause theo hover/focus, viewport, document hidden và reduced motion.

## Kiểm chứng

- 16/16 tests pass: gồm trường dữ liệu của cả 84 thẻ, kéo chuột, chặn click, nhóm ẩn và lifecycle carousel chung.
- Build, kiểm tra local và HTTP pass: 154 tài nguyên, không thiếu file hoặc ID trùng.
- Viewport 360/390/768/1280/1440/1620/1920: không tràn ngang, hiển thị tương ứng 2/2/3/5/5/6/6 thẻ, gap 10 px.
- Desktop 1280/1440: section 1200 px, card 227.1875 px, title 688 × 75 px; tên 14/17 px, giá 16/20 px. Chiều cao card 358.1875 px và section 502.6875 px khớp nguồn ở 1280 px.
- Desktop 1920: section 1600 px, card 254.328125 px; tên 16/20 px, giá 18/22 px.
- Tại 1620 px có scrollbar trang: section co còn 1585 px để không tràn ngang, card 251.828125 px. Đây là ngoại lệ responsive đã chốt.
- Đã click cả sáu nhóm bằng Chrome DevTools: số thẻ 20/7/7/20/16/14; chỉ một panel mở, track trở về 0, bộ chọn đóng và focus đúng. Home/End/Escape kiểm tra bằng phím thật.
- CSS khoảng 38.7 KB; ui.js khoảng 5.4 KB gzip, đạt ngân sách.

## Ảnh và giới hạn

[Local 1920 px](screenshots/sale-local-1920.jpg). Ảnh thể hiện carousel trong quá trình chạy; không dùng ảnh này để tuyên bố so khớp vị trí thẻ đầu. Mẫu có các nút nhóm trống; bản local dùng bộ chọn có nhãn theo lựa chọn của người dùng.

[Nguồn 1280 px](screenshots/sale-reference-1280.jpg) · [Số đo responsive](sale-measurements.json).

Kéo chuột, giảm chuyển động, autoplay và nhóm ẩn được kiểm tra bằng tests với clock xác định; responsive và chọn nhóm được kiểm tra trên Chrome profile riêng. Chưa thử vuốt trên điện thoại vật lý.
