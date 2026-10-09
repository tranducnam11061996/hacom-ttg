# Báo cáo chuyển đổi và tối ưu SEO / hiệu năng TTG

Ngày: 09/10/2026. Bản bàn giao mã nguồn tại thời điểm người dùng yêu cầu push GitHub; chưa phải xác nhận hoàn tất mọi tiêu chí nghiệm thu của kế hoạch SEO.

## Phạm vi và thay đổi

- Chuyển giao diện sang Next.js App Router, TypeScript, Tailwind CSS 4. Có 10 màn hình; component dùng chung, feature và dữ liệu được tổ chức trong src; ảnh/font trong public. Một package npm tại root.
- Metadata riêng cho 10 route; giữ tiếng Việt, favicon và viewport. Chuẩn hóa heading bằng class CSS để bảo toàn cách hiển thị, thêm heading ẩn cho danh sách sản phẩm; playlist dùng cấp heading theo ngữ cảnh.
- Ảnh/tên sản phẩm dẫn đến cùng màn chi tiết mẫu; danh mục bán hàng dẫn đến /pc. Dùng Next Link và tắt prefetch trên các liên kết lặp. Nút nghiệp vụ và biểu mẫu vẫn demo.
- Bốn playlist render heading, poster và danh sách tập từ server. Query video được xác thực trong playlist; URL và Back/Forward đồng bộ. YouTube API/iframe chỉ tải sau bấm phát, có cleanup và liên kết xem trên YouTube.
- Khuyến mãi chỉ mount nhóm đang chọn, giảm 64 thẻ sản phẩm ẩn ở trạng thái ban đầu. Tách state bộ lọc, mô tả, popup khỏi phần sản phẩm/hỗ trợ tĩnh. Header nhận dữ liệu cần dùng thay vì import snapshot trang chủ.
- Gom đo layout và ghi style qua RAF cho header/carousel; dừng công việc carousel ngoài viewport. Tooltip lưu tọa độ bằng ref, cập nhật tối đa một lần mỗi frame và cache kích thước. Cleanup listener, observer, timer và RAF.
- Khóa cuộn popup giữ ổn định scrollbar, khôi phục khi đóng/unmount. Giữ kích thước ảnh/player và chiều cao placeholder header.
- Thumbnail playlist đầu tiên tải eager; loading độc lập với fetchPriority. Tách CSS cửa hàng khỏi video và CSS từng feature theo route.
- 22 ảnh PNG chuyển WebP lossless sau kiểm tra RGBA bằng nhau, tổng kích thước các file thay thế giảm 3.379.719 byte. Đây không phải tổng tiết kiệm payload của một lần tải trang. Các ảnh PNG gốc còn được giữ.
- Giữ nguyên Inter và thứ tự font-face gốc. Preload ba subset với fetchPriority low; cache font production một giờ. Không giữ thử nghiệm fallback metric hoặc đổi thứ tự font-face vì có tác động đến hình thức/hiệu năng.
- Không thêm GA/GTM, backend, database, schema thương mại, domain canonical hoặc hosting.

## Kiểm tra thực hiện

HTML production của cả 10 route trả 200, title/description riêng, mỗi trang một H1. Bốn playlist có sẵn 2/20/30/30 liên kết tập trong HTML; chưa có iframe trước thao tác phát. Chi tiết nằm trong [html-validation.json](html-validation.json).

Đã thao tác qua Chrome DevTools MCP với profile chuyên dụng: menu mobile, sáu nhóm khuyến mãi, tooltip, bộ lọc mobile, popup Build PC, nhập biểu mẫu giỏ hàng, liên kết sản phẩm, chọn tập, Back/Forward và phát video. Không quan sát lỗi hydration của dự án trong các thao tác này; khóa cuộn được khôi phục. Đây là kiểm tra theo kịch bản, không phải chứng minh mọi hành vi đều không có lỗi.

Lint, typecheck và build được chạy lại khi đóng gói. Log tương ứng trong thư mục này. Các công cụ kiểm tra tạm không đưa vào mã nguồn chạy ứng dụng.

## Hiệu năng lab

Production, viewport 390 × 844, CPU chậm 4 lần, Fast 4G. Ba lần cho mỗi hàng; số đo không phải INP p75 người dùng thực. Hai phương pháp đo được tách riêng.

| Kịch bản / phương pháp | Ba lần LCP (ms) | Trung vị (ms) | CLS |
| --- | --- | --- | --- |
| Home trước sửa, cache có sẵn, Chrome trace | 915 / 2092 / 894 | 915 | 0 |
| Home sau sửa, cache có sẵn, Chrome trace | 902 / 656 / 709 | 709 | 0 |
| PC trước sửa, cache có sẵn, Chrome trace | 560 / 640 / 551 | 560 | 0 |
| PC sau sửa, cache có sẵn, Chrome trace | 657 / 775 / 731 | 731 | 0 |
| Home bản cuối, cache mới, PerformanceObserver | 1852 / 1856 / 1776 | 1852 | 0 |
| Home bản cuối, cache có sẵn, PerformanceObserver | 600 / 696 / 480 | 600 | 0 |

Home warm trace cải thiện khoảng 23%. PC warm trace chậm hơn 171 ms, khoảng 31%; dù vẫn dưới 2,5 giây, cần điều tra lại để đạt tiêu chí không hồi quy rõ rệt. Không gộp số đo trace và observer thành một chuỗi so sánh.

Home tải lạnh còn long task khoảng 542–648 ms trong các lần đo; do đó không khẳng định đã loại bỏ toàn bộ công việc nặng trên main thread. Snapshot observer ghi khoảng 3.153 phần tử DOM và 107 thẻ sản phẩm ở trạng thái đầu; các số byte tài nguyên trong JSON chỉ theo tập tài nguyên quan sát ở kịch bản đó.

Các thao tác đo Event Timing: đổi nhóm khuyến mãi khoảng 24–112 ms; mở bộ lọc mobile 144/80/56 ms; mở popup Build PC 296/56/56 ms, đóng 80/48/40 ms. Lần đầu mở popup vượt mục tiêu 200 ms và cần tiếp tục tối ưu. Không gọi các số này là INP thực tế.

[Trace summaries](performance-trace-summaries.json) lưu kết quả Chrome MCP trả về; [observer và popup](performance-observer-final.json) lưu lần đo bản cuối. Xuất raw trace theo filePath bị MCP từ chối truy cập đường dẫn, nên không có raw trace file trong bản bàn giao.

## Đối chiếu giao diện và giới hạn nghiệm thu

Đã khảo sát 10 route ở 390, 768, 1024, 1280, 1440, 1620 và 1920 px. Sau các sửa về CSS liên hệ, banner và popup, chiều cao trang trong vòng đo trung gian không đổi so với baseline.

**Quan trọng:** final-geometry.json, screenshot-comparison.json và ảnh có tiền tố final là vòng đo trung gian của thử nghiệm đổi thứ tự font subset. Vòng đó còn khác kerning/chiều rộng một số dòng khoảng tối đa 0,62 px; thử nghiệm đã được hoàn tác. Không dùng tên file “final” để kết luận bản commit cuối đạt pixel-identical. Chưa chụp/đối chiếu lại toàn bộ ma trận 70 trường hợp sau khi hoàn tác font. Ảnh before/after/final được giữ để truy vết quá trình, không phải toàn bộ đều đại diện bản commit cuối.

Các phần còn cần kiểm tra hoặc hoàn thiện:
- Đối chiếu ảnh/computed style toàn bộ ma trận trên bản cuối.
- Điều tra hồi quy LCP warm của /pc và độ trễ lần mở popup đầu.
- Đo ba lần mỗi kịch bản còn lại trên cấu hình cuối; kiểm tra lại FAQ, lưu vị trí carousel theo tab và toàn bộ trạng thái mở.
- Rà soát selector/asset dư để hoàn tất việc dọn dự án. HTML, scripts, tests và báo cáo lịch sử cũ hiện vẫn còn trong repository; ứng dụng Next.js không phụ thuộc chúng. Trước đó việc xóa hàng loạt đã bị automatic approval review từ chối; vòng push này giữ nguyên trạng thái, không thực hiện lại thao tác xóa.

## Bằng chứng và bàn giao

- before-geometry.json: baseline; after-geometry.json: vòng đối chiếu trước thử nghiệm font; final-geometry.json: vòng thử nghiệm font đã hoàn tác.
- screenshots/: ảnh PNG trước/sau và vòng thử nghiệm; không giữ bản base64 trung gian.
- lossless-images.json: kết quả chuyển ảnh và kích thước.
- performance-trace-summaries.json, performance-observer-final.json: số đo có cấu hình và giai đoạn rõ ràng.
- lint.log, typecheck.log, build.log: log kiểm tra đóng gói.
- Báo cáo các vòng trước nằm trong docs; báo cáo dữ liệu chuyển đổi nằm ở ../2026-10-09-migration/.

Theo yêu cầu mới của người dùng, báo cáo và ảnh đối chiếu được đưa vào GitHub. node_modules, .next, cache, file môi trường và file tạm bị loại bằng .gitignore; chúng không cần thiết để dựng dự án từ npm lockfile.

