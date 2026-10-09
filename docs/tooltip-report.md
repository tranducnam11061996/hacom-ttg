# Tooltip danh mục — kết quả triển khai

Đối chiếu bằng Chrome DevTools MCP, profile riêng, ngày 08/10/2026. Nguồn: https://ttgshop.vn/pc. Local: http://127.0.0.1:4173/pc/.

## Hành vi đã đồng bộ

- Tooltip bám con trỏ trong vùng ảnh; đổi sang trái theo khoảng trống viewport, với gap 10 px và phép so sánh `>` của nguồn.
- Chiều rộng 377 px dưới 1620 px, 420 px từ 1620 px; đo lại khi đổi breakpoint.
- Chiều cao tự nhiên; không có thanh cuộn nội bộ. Phần vượt viewport bị khuất. Chiều cao nội dung dùng để định vị không tính padding dưới 10 px.
- Tooltip đặt trong lớp ở cấp body; cuộn trang giữ tọa độ tài liệu. Rời ảnh đóng ngay và hủy frame đang chờ.
- Bàn phím: focus mở tại tâm ảnh, blur đóng, Escape đóng và ngăn mousemove mở lại đến lần kích hoạt mới. Dưới 768 px không mở tooltip.
- Nội dung và giá giữ nguyên snapshot; dấu `...` là nội dung tĩnh sau năm dòng cấu hình.
- Typography, khoảng cách nhãn, icon, dòng khuyến mại và cách raster chữ đã được đối chiếu bằng ảnh diff.

## Đo hình học

108 điểm, gồm đầu/giữa/cuối ảnh của từng cột trong hàng đầu, ở chiều cao 600 và 900 px. Sai lệch lớn nhất của left/top/width/height: **0 px**. Tất cả điểm chọn cùng sản phẩm, đúng phía và chỉ một tooltip hiển thị.

| Viewport | Số điểm | Sai lệch lớn nhất |
|---|---:|---:|
| 1280 px | 24 | 0 px |
| 1440 px | 24 | 0 px |
| 1620 px | 30 | 0 px |
| 1920 px | 30 | 0 px |

Chi tiết từng điểm nằm trong [tooltip-comparison.json](tooltip-comparison.json).

## Ảnh đối chiếu

Tỷ lệ diff tính trong vùng tooltip nhìn thấy, với ngưỡng chênh lệch một kênh màu lớn hơn 30/255. Các khác biệt vượt ngưỡng còn lại nằm ở giá snapshot; xem ảnh diff để kiểm tra trực tiếp.

| Trạng thái | Chiều cao nguồn/local | Diff >30 | Ảnh |
|---|---|---:|---|
| Dài, 1440×900 | 682/682 px | 0,556% | [Nguồn](screenshots/tooltip-long-1440-source.png), [local](screenshots/tooltip-long-1440-local.png), [diff](screenshots/tooltip-long-1440-diff.png) |
| Bị khuất, 1620×600 | 708/708 px; 108 px ngoài viewport | 0,567% | [Nguồn](screenshots/tooltip-clipped-1620-source.png), [local](screenshots/tooltip-clipped-1620-local.png), [diff](screenshots/tooltip-clipped-1620-diff.png) |
| Ngắn, 1620×900 | 462/462 px | 0,217% | [Nguồn](screenshots/tooltip-short-1620-source.png), [local](screenshots/tooltip-short-1620-local.png), [diff](screenshots/tooltip-short-1620-diff.png) |
| Cột 4, 1920×900 | 675/675 px | 0% | [Nguồn](screenshots/tooltip-right-1920-source.png), [local](screenshots/tooltip-right-1920-local.png), [diff](screenshots/tooltip-right-1920-diff.png) |

Mẫu CORE ULTRA 5 có giá live 37.980.000 VNĐ và snapshot 38.480.000 VNĐ. Mẫu 5600X3D – RTX 3060 có giá live 24.860.000 VNĐ và snapshot 24.980.000 VNĐ. Giá không được cập nhật trong lần sửa tooltip này.

## Kiểm thử

- `npm run build`: đạt.
- `npm test`: 36/36 đạt, gồm 6 test tooltip cho ngưỡng đổi phía, chiều cao, frame bị hủy, khởi tạo lại, Escape, focus/blur, cuộn và resize.
- `npm run check`: 0 lỗi tham chiếu local.
- `npm run check:http`: 220 file public, 0 lỗi.
- Trình duyệt: hover thật và Escape; focus/blur; rời ảnh trước khi RAF chạy; chuyển nhanh sản phẩm; giữ tooltip khi cuộn; resize 1440↔1620; khởi tạo lại chỉ một overlay. Tất cả đạt.
- Responsive 360/390/768/1024: scrollWidth bằng viewport. Mobile không mở tooltip; panel lọc mở với focus trong dialog và đóng bằng Escape.
- Hồi quy trang chủ và video: không có lỗi console hoặc ảnh hỏng; module tooltip không khởi tạo trên các trang này. Trang chủ giữ 171 thẻ sản phẩm.

Thay đổi chính: bộ điều khiển độc lập `js/modules/product-tooltips.js`, tích hợp trong module danh mục, CSS danh mục và các test tooltip. Không thêm dependency hay tải dữ liệu nguồn trong build.
