# Audit màu và mảng nền theo preview2.pdf

Ngày kiểm tra: 13/10/2026. Bản này thay thế các quyết định màu và họa tiết showroom ở các lượt trước. Giữ logo chính thức và tên TGB SHOP; banner, hàng hóa và chức năng theo phạm vi đã duyệt.

## Kết quả triển khai

| Vùng | Nguồn | Style cuối cùng |
| --- | --- | --- |
| Top bar | Trang 1 | #111010 |
| Pill, tìm kiếm, giỏ hàng header thường | Trang 1 / Sh0 | Gradient #FD0A8F → #A10051, hàm đảo chiều N=1.56613, không chuyển động |
| Menu đang chọn | Trang 1 / Sh1 | Gradient #FD0A8F → #111010, N=1.22466; mega title hồng sáng |
| Deal HOT | Trang 2 / đường vector, shadings, soft masks | #1C1920; SVG giữ mảng xiên, vệt sáng, cụm chấm vuông, phép biến đổi và độ trong suốt gốc |
| Nhãn Deal HOT | Trang 2 / vector | Ngọn lửa lớn nhô lên, gradient, đường viền trắng và mũi tên gốc; chữ HTML |
| Tiêu đề danh mục | Trang 2 / Sh1 và đường cắt | Hai lớp đuôi chéo theo PDF, không còn tam giác đen đơn |
| Cam kết | Trang 2 / Sh0 | Tên cửa hàng #FD0A8F; gradient dọc #FD0A8F → #5A0E37, N=1.60418 |
| Showroom | Trang 2 / Sh9, P0, Fm5/Fm6 | Nền #181818, viền #FD0A8F → #FD9CA1, cụm dải chéo theo tọa độ gốc; bỏ mask góc nhỏ |
| Tooltip | Trang 3 / Sh0, Sh1, Sh2 | Header/nhãn hồng sáng–đen, giá và phần nhấn mạnh có gradient riêng; đoạn dẫn đen, quà hồng sáng, kiểm xanh ngọc |
| Thanh giá, nút mua kèm | Trang 4 / Sh0 | Hồng sáng–đen theo hàm PDF; bỏ nền tối riêng sau chữ phụ |
| Nâng cấp | Trang 4 | Nền trắng, chữ xám; viền và góc đánh dấu gradient, dấu kiểm trắng |
| Tư vấn nâng cấp | Ảnh nhúng trang 4 | Gradient tím–xanh–tím, đo từ hàng pixel tránh chữ; trạng thái mặc định tĩnh |
| UPGRADE, khuyến mại, Mua combo | Trang 4 | Icon đỏ; Mua combo chữ/viền đỏ, không đổi sang hồng |
| Giỏ hàng trên card | Ảnh nhúng trang 2 | #263B96 đo từ vùng phẳng; giá #E40000, tồn kho xanh, giá gạch ngang #9A9A9A |

Các gradient được sinh tại `src/styles/pdf-gradients.css`; token cũ tiếp tục phục vụ các trang không có mẫu. Không thay gradient mặc định của giỏ hàng, Build PC hoặc video bằng gradient của PDF ngoài các thành phần dùng chung được chỉ định.

## Cách trích xuất và độ chính xác

[Script trích xuất](../../scripts/brand/export-pdf-style.py) đọc trực tiếp đường path, clipping, CTM, hàm Type 2/3, opacity và soft mask từ PDF. Raster image và PDF text được loại khỏi SVG trang trí. Chữ giao diện vẫn là HTML; dữ liệu sản phẩm không đi vào asset trang trí.

- Nền Deal HOT được tách đầu/cuối khối để giữ vị trí các vệt sáng và chấm khi chiều cao nội dung thay đổi.
- Tọa độ vector giữ 7 chữ số có nghĩa; sai số làm tròn tại các vùng này nhỏ hơn 0,001 pt. Xem [inventory](pdf-vector-inventory.json).
- Gradient CSS nội suy trong sRGB, được kiểm tra tại 10.001 vị trí. Sai số lớn nhất mỗi kênh RGB: **0,252/255**, đạt ngưỡng dưới 1/255. Xem [thông số gradient](pdf-gradients.json) và [kết quả validation](pdf-validation.json).
- Viền showroom từ gradient gốc; glow trong PDF là ảnh raster #FFC2E6 với Screen 75%. CSS dùng màu tương đương #FFC8E8 trên #181818 và Gaussian blur gần profile alpha nguồn. Glow là phần tái dựng từ raster, không phải đường vector có thể đối chiếu tuyệt đối.
- Mẫu nền đầu Deal HOT sau chuẩn hóa có sai số RGB trung bình khoảng **1,322/255**; 90,61% pixel của mẫu nằm trong ±3 mỗi kênh. Đây là số đo trên một vùng nền, không phải tỷ lệ giống toàn giao diện. Crop bán pixel, nén ảnh và khác biệt renderer ảnh hưởng vùng biên.
- SVG bảo toàn hình học nguồn. Responsive co giãn theo vùng chứa và dành khoảng an toàn cho chữ; mẫu PDF chỉ quy định desktop. Không tuyên bố toàn trang giống từng pixel vì logo, nội dung, ảnh hàng hóa, font và bố cục được giữ theo phạm vi.

PDF được render lại ở 72 dpi trong [reference](reference). [So nền đầu Deal HOT](reference/compare-deal-top.png), [so nhãn](reference/compare-deal-label.png), [so dải showroom](reference/compare-showroom-stripes.png) đặt mẫu PDF bên trái và lớp vector đã trích bên phải. Các ảnh so vector bỏ chữ và ảnh sản phẩm theo phạm vi.

## Ảnh PDF–UI

[Mở bảng đối chiếu](pdf-style-comparison.html). Bộ ảnh mới ở [pdf-style-screenshots](pdf-style-screenshots); ảnh của các lượt trước chỉ dùng làm lịch sử.

| Vùng | PDF render mới | UI sau chỉnh |
| --- | --- | --- |
| Header | [Mẫu](reference/pdf-region-header.png) | [Desktop](pdf-style-screenshots/header-desktop.png) |
| Menu | [Mẫu](reference/pdf-region-menu.png) | [Desktop](pdf-style-screenshots/menu-desktop.png) |
| Deal HOT, danh mục | [Deal HOT](reference/pdf-region-deal.png), [tiêu đề](reference/pdf-region-category.png) | [Desktop](pdf-style-screenshots/deal-desktop.png), [mobile](pdf-style-screenshots/deal-mobile.png) |
| Dịch vụ, cam kết | [Mẫu](reference/pdf-region-services.png) | [Desktop](pdf-style-screenshots/services-desktop.png) |
| Showroom | [Mẫu](reference/pdf-region-showroom.png) | [Desktop](pdf-style-screenshots/showroom-desktop.png), [mobile](pdf-style-screenshots/showroom-mobile.png) |
| Tooltip | [Mẫu](reference/pdf-region-tooltip.png) | [Desktop](pdf-style-screenshots/tooltip-desktop.png) |
| Sản phẩm | [Mẫu](reference/pdf-region-product.png) | [Desktop](pdf-style-screenshots/product-desktop.png), [mobile](pdf-style-screenshots/product-mobile.png), [mua kèm](pdf-style-screenshots/combo-desktop.png) |

## Kiểm tra và giới hạn

- Lint, typecheck và production build đều đạt. `git diff --check` đạt.
- **32 trường hợp**: 8 trang × 375/768/1280/1920 px. Không tràn ngang hoặc có ảnh đã tải bị hỏng. [Chi tiết viewport](pdf-viewport-checks.json).
- 8 trang không ghi nhận console error/warning. [Console](pdf-console-checks.json).
- Menu mở, mục active và Escape; tab Deal HOT đổi collection; tooltip bằng focus; responsive showroom và thanh giá được kiểm tra trên browser.
- Gallery và lựa chọn nâng cấp dùng DemoButton sẵn có: bấm hiện thông báo demo, không đổi ảnh/config thật. Hành vi này được giữ nguyên.
- SHA-256 của **395 asset public đã tồn tại trước lượt chỉnh** đều giữ nguyên, bao gồm toàn bộ banner, ảnh sản phẩm và overlay. PDF nguồn cũng giữ nguyên hash `3302128a06a64959345338f4ac9e1aa0ab9134e239e7b5117c6613d548f3d271`.
- JSON chỉ sửa class/style tại trường tooltipHtml; các trường dữ liệu khác được so sánh trước/sau và giữ nguyên. Các đoạn chữ đen lồng bên trong phần nhấn mạnh tiếp tục đen.
- Màu mặc định theo PDF được ưu tiên theo quyết định người dùng; mức tương phản của hồng sáng không còn bị sửa sang hồng đậm ở vùng mẫu. Hover, focus và disabled tiếp tục có dấu hiệu tương tác.

Browser automation sử dụng Chrome DevTools MCP qua launcher và profile riêng, trên tab tác vụ đã xác minh URL. Không dùng browser cá nhân hoặc công cụ browser thay thế.
