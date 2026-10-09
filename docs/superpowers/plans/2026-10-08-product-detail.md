# Plan màn Chi tiết sản phẩm TTG

**Goal:** Dựng màn local khớp giao diện desktop của sản phẩm PC TTG GAMING CORE ULTRA 7 270K PLUS - RTX 5070 12GB OC, tái sử dụng nền UI hiện có và giữ phạm vi demo.

**Architecture:** HTML tĩnh được render bằng ES-module templates tại bước build, CSS Tailwind hiện có, dữ liệu snapshot và ảnh local. Không thêm framework hoặc thư viện giao diện. Trang gọi storeLayout để import header/footer hiện có.

**Tech Stack:** Node.js ES modules, Cheerio, Sharp, Tailwind CSS 4.3.0, HTML và JavaScript hiện có.

## 1. Nguồn đối chiếu và phạm vi

- Nguồn: https://ttgshop.vn/pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc
- Đã đối chiếu bằng Chrome DevTools MCP sau khi sửa launcher và restart Codex.
- Evidence đang lưu tại .cache/product-detail-reference/: ảnh desktop 1920, ảnh desktop 1440 sau khi tải sản phẩm tương tự, ảnh mobile, số đo và DOM nguồn.
- Danh sách tương tự chỉ tải khi cuộn tới section; snapshot phải lấy đủ 15 thẻ thật, không lấy 6 placeholder ban đầu. Giữ nguyên thứ tự và cả sản phẩm hiện tại nếu nguồn có trong danh sách.
- Thu thập 7 ảnh gallery, 4 nhóm mua kèm, 8 dòng cấu hình, các lựa chọn upgrade, khuyến mãi, mô tả HTML và bảng thông số 8 dòng.
- Bỏ toàn bộ iframe “Máy này chơi game thế nào?”, sentinel, script, request và khoảng trống dành cho khối này. Các vùng bên dưới dịch lên; không dùng tọa độ Y toàn trang gốc làm tiêu chí.
- Giữ nguyên nội dung nguồn kể cả khi mô tả dài khác cấu hình tóm tắt (B860M/Z890M, HIKSEMI/SSTC, FSP/Gigabyte). Đây là bản sao giao diện, không biên tập nội dung sản phẩm.

## 2. Dữ liệu, assets và build

- [x] Tạo collector chạy riêng và snapshot product-detail. Collector lấy HTML công khai, thu thập DOM danh sách tương tự sau khi cuộn và chờ tên sản phẩm đầu xuất hiện; không gọi collector trong build thường.
- [x] Snapshot chứa source/collectedAt, productId, slug, title/breadcrumb, giá hiển thị, bảo hành, gallery, summary, upgradeGroups/selectedIndex, promotionHtml, comboGroups, descriptionHtml, specificationHtml, similarProducts và assets. Giá giữ định dạng chuỗi nguồn; không tính lại trả góp hoặc tiết kiệm.
- [x] Tải ảnh gốc theo hash, kiểm tra asset map hiện có để tái sử dụng bytes trùng. Giữ cả ảnh lớn và thumbnail đúng nguồn; không dùng ảnh 250px thay ảnh gallery lớn. Đặt width/height và alt; ảnh chính ưu tiên tải, ảnh dưới màn lazy-load.
- [x] Làm sạch HTML mô tả/khuyến mãi/thông số: bỏ script, inline handlers và mã tích hợp; chuyển ảnh sang local và link nghiệp vụ sang demo. Giữ các style nội dung cần thiết để khớp typography; không import nguyên CSS/JS bên TTG.
- [x] Thêm build:product vào pipeline trước build:css. Build dùng snapshot, chạy offline và xuất file HTML chứa đầy đủ nội dung.
- [x] URL local chuẩn: /pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc/; file đầu ra là index.html trong thư mục slug, context.depth=1.
- [x] Đăng ký trang trong scripts/public.mjs; preview hỗ trợ slug không dấu / cuối tương tự /pc. Cập nhật hướng dẫn upload thư mục slug, public-file/HTTP checks và README.

## 3. Component và bố cục

- [x] Tạo productDetailContent({ productData, storeData, context }) để ghép nội dung; build gọi storeLayout({ content, storeData, headerData, context, mainClass: 'product-detail-screen', pageScript: 'ui' }). Layout sở hữu main; nội dung chỉ có một H1.
- [x] Import header/footer thông qua storeLayout. Import serviceBenefits và commitment hiện có ở cuối trang; không sao chép markup hoặc dữ liệu của các component dùng chung.
- [x] Tách component sản phẩm theo trách nhiệm: gallery; combo mua kèm; summary/giá/cấu hình/khuyến mãi/nút mua; mô tả/bảng thông số; section sản phẩm tương tự. Các component nhận dữ liệu, trả markup và không đọc file/gọi mạng.
- [x] Tách riêng similarProducts({ products, assets, overlays, context, id, title, allHref }) trong components để màn sau gọi lại. Nó dùng productCard hiện có; không viết bộ thẻ sản phẩm thứ hai. id do caller cấp để các rail không trùng ID.
- [x] Dùng productCard mặc định và CSS theo section cho khác biệt đo được. Chỉ bổ sung option href mặc định '#' cho ảnh/tên sản phẩm; link tới màn local mới được resolve tập trung cho sản phẩm đã có trang. Các sản phẩm khác tiếp tục demo.
- [x] CSS màn mới nằm trong product-detail.input.css, import vào entry hiện có và phát hành chung site.min.css. Selector bắt đầu bằng product-detail/pd để tránh ảnh hưởng trang chủ, category, header/footer.
- [x] Desktop >=1280: container ngoài 1220px với padding ngang 10px, nội dung 1200px; từ 1620 container ngoài 1620px và nội dung 1600px. Khối đầu hai cột bằng nhau, padding 14px 12px 18px, gap 12px/16px, nền trắng, bo 8px.
- [x] Gallery ở cột trái: ảnh ban đầu là ảnh đầu nguồn; giữ tỷ lệ vùng ảnh 67% và phần đệm/overlay riêng 14% như DOM nguồn, không ép ảnh thành hình vuông. Thumbnail 5 ô dưới 1620 và 6 ô từ 1620, gap 12px, viền cam ô đầu. Combo nằm dưới, hiển thị 3 nhóm đầu dưới 1620 và 4 nhóm từ 1620 (đã xác minh lại sau reload nguồn) với chiều cao thẻ tối thiểu 290px.
- [x] Cột phải giữ thứ tự H1, khung giá gradient, bảo hành/tư vấn, 8 dòng cấu hình, upgrade, khuyến mãi, số lượng=1 và các nút đặt hàng/giỏ/trả góp. H1 20px/24px, từ 1620 là 24px; giữ font Inter local và các cỡ chữ/màu/viền của nguồn.
- [x] Mô tả/thông số cách khối đầu 20px. Mô tả rộng 695px/1062px, bảng dùng phần còn lại, gap 12px; cả hai clip nội dung ở 500px với fade và nút Xem thêm đúng nguồn. Bảng sticky top 12px trên desktop.
- [x] Section tương tự hiển thị 5/6 thẻ desktop dưới/từ 1620, gap 10px, có tiêu đề, Xem tất cả và mũi tên đúng nguồn. Render đủ 15 sản phẩm ngay trong HTML, không gọi API runtime hoặc hiển thị skeleton.
- [x] Mobile/tablet mặc định: dưới 1280, phần thân chi tiết xếp một cột theo thứ tự gallery → thông tin/nút mua → combo → mô tả → thông số → tương tự → support. Padding 12px; tắt sticky bảng. Thumbnail 4 ô dưới 768, 5 ô từ 768; combo 2/3 ô dưới/từ 768; tương tự 2/3 ô dưới/từ 768. Rail dùng native overflow, không tạo tràn ngang toàn trang. Header/footer dùng responsive sẵn có.

## 4. Phạm vi demo

- [x] Không tạo giỏ, thanh toán, tư vấn thật, chọn combo, thay đổi cấu hình, tính giá, cập nhật số lượng hoặc lưu storage.
- [x] Mọi nút mới, kể cả mũi tên gallery/rail và Xem thêm, gắn data-demo và dùng thông báo demo hiện có; không thêm handler chức năng mới. Giữ trạng thái ban đầu: ảnh đầu, cấu hình gốc, số lượng 1, mô tả/thông số thu gọn.
- [x] Ô số lượng readonly; upgrade giữ dấu chọn gốc và không đổi giá/trạng thái khi bấm. Không tạo modal chọn mua kèm, lightbox hay autoplay mới.
- [x] Không gắn data-category-carousel lên rail tĩnh để initStore không tự khởi tạo carousel. Dữ liệu đủ 15 thẻ vẫn có thể xem bằng cuộn native.
- [x] Điều hướng Trang chủ, PC GAMING và sản phẩm đã có màn local hoạt động. Nút Xem tất cả dẫn tới danh mục PC local. Tương tác header/footer/commitment hiện có giữ như trước.
- [x] Nút có type=button, nhãn truy cập, focus-visible; không dùng javascript: URL hoặc inline onclick. Không thêm nhãn demo lớn làm lệch giao diện.

## 5. Kiểm chứng và nghiệm thu

- [x] Test snapshot/collector: đủ 7 ảnh, 4 nhóm combo, 8 dòng cấu hình/thông số, 15 sản phẩm tương tự; thiếu asset hoặc thu nhầm placeholder phải làm collector thất bại.
- [x] Test build: header/footer đúng một lần, một main/H1, tất cả ảnh và module local hợp lệ, không iframe/checkgame/legacy code, demo buttons và readonly quantity đúng phạm vi.
- [x] Test điều hướng sản phẩm hiện tại từ homepage và PC listing; link trang con hoạt động cả ở hosting root lẫn dưới thư mục con. Không thay link sản phẩm chưa có trang.
- [x] Chạy npm run build, npm test, npm run check và npm run check:http; xác minh build không gọi mạng. Preview chặn snapshot/template/cache.
- [x] Đối chiếu bằng Chrome DevTools MCP tại 1280, 1440, 1620, 1920, DPR=1: chờ font/ảnh, dùng vị trí rail đầu tiên ổn định, chụp từng vùng và tạo overlay/diff. So sánh riêng các vùng để bỏ ảnh hưởng phần checkgame bị loại.
- [x] Mục tiêu cấu trúc/màu/nội dung/asset đúng nguồn; sai số hình học chủ chốt <=1 CSS px. Báo cáo phải nêu sai lệch còn lại, không coi “giống 100%” là kết quả trước khi so ảnh. Khác biệt raster font và animation nguồn được ghi riêng.
- [x] Kiểm tra 390/768/1024: không tràn ngang toàn trang, bảng đọc được, CTA không đè nội dung, header/footer không hồi quy.
- [x] Bấm nút mới không gửi request nghiệp vụ, không thay giá/cấu hình/số lượng; hiển thị toast demo. Không sửa chức năng video hiện có.
- [x] Lưu báo cáo, measurements và ảnh source/local/diff trước khi bàn giao.

## Defaults đã chọn

- Chỉ dựng sản phẩm trong URL được yêu cầu; component/snapshot hỗ trợ tái sử dụng cho sản phẩm sau.
- Desktop bám nguồn; mobile được bố trí lại để đọc được. Đây là lựa chọn mặc định được đề xuất trong câu hỏi gửi người dùng; cần cập nhật nếu người dùng chọn giữ bố cục mobile gốc.
- Các nút mới chỉ demo theo đúng yêu cầu; không tự thêm tương tác gallery hoặc Xem thêm trong đợt này.
- Không đổi stack, không bổ sung dependency frontend hoặc backend.

