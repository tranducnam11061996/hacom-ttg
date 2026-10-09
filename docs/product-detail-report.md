# Chi tiết sản phẩm TTG — triển khai và đối chiếu

Nguồn: https://ttgshop.vn/pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc. Snapshot lấy ngày 08/10/2026. URL local: `/pc-ttg-gaming-core-ultra-7-270k-plus-rtx-5070-12gb-oc/`.

## Kết quả

Trang đã dựng bằng HTML tĩnh/ES-module templates và Tailwind hiện có. `storeLayout` import header/footer chung; thân trang import gallery, summary/upgrade/khuyến mãi/nút mua, combo, mô tả/thông số, section tương tự và support chung. Không thêm framework, thư viện browser hoặc JavaScript nghiệp vụ.

Snapshot chứa 7 ảnh gallery, 4 nhóm mua kèm, 8 dòng cấu hình, 3 nhóm upgrade, bảng thông số 8 thiết bị và đủ 15 sản phẩm tương tự thật, giữ thứ tự nguồn. 37 asset tham chiếu dùng file local; bytes ảnh được giữ nguyên và hash được kiểm tra. Nội dung mô tả dài khác cấu hình tóm tắt vẫn được giữ nguyên như nguồn.

`scripts/templates/components/similar-products.mjs` nhận products/assets/overlays/context/id/title/allHref, gọi `productCard` hiện có. Các màn sau có thể import component này; mỗi rail phải có id riêng. Liên kết ảnh/tên của sản phẩm đã có trang được resolve tập trung qua `productHref`; sản phẩm khác vẫn demo. Trang chủ và danh mục PC đều có link tới chi tiết local.

Khối “Máy này chơi game thế nào?” đã bỏ hoàn toàn, gồm iframe, script và khoảng trống. Giá, số lượng, cấu hình, ảnh đầu và trạng thái thu gọn được giữ cố định. Mọi nút mới dùng `data-demo`; không giỏ hàng, checkout, tư vấn thật, lightbox, chọn combo, autoplay hoặc request nghiệp vụ. Header/footer/commitment dùng tương tác hiện có.

Desktop giữ hai cột và kích thước nguồn. Dưới 1280 px, phần thân xếp gallery → thông tin/nút mua → combo → mô tả → thông số → tương tự → support để đọc được. Đây là bố cục mobile trong plan đã duyệt, khác trang nguồn vốn giữ bố cục desktop rộng.

## Đối chiếu Chrome DevTools

Chỉ dùng Chrome DevTools MCP qua launcher quản lý profile chuyên dụng. Một tab nguồn và một tab local thuộc nhiệm vụ này. Ảnh và JSON được lưu vào Temp bằng MCP rồi sao chép vào workspace; không mở quyền ghi roots rộng hơn. Khi renderer tab nguồn treo ở `Page.captureScreenshot`, một MCP client khác cũng qua launcher đã xác minh URL và đóng riêng tab nguồn của nhiệm vụ; tab thay thế hoạt động lại. Profile/cookie, Chrome và tab local được giữ nguyên. Không chuyển backend browser.

Đã đối chiếu tại 1280/1440/1620/1920, DPR=1, viewport cao 1000 px. Danh sách nguồn được tải đủ trước khi chụp, carousel đặt về ô đầu và dừng autoplay. Iframe game được bỏ khỏi bản nguồn trong tab đối chiếu để so đúng phạm vi. Vùng mô tả và tương tự được căn theo section; sau khi header thu gọn phải căn lại do placeholder nguồn thay đổi chiều cao.

| Viewport | Sai số lớn nhất của 15 khối chính (x/y/w/h) | Pixel khác màu >30/255: đầu trang | Mô tả/thông số | Tương tự |
|---|---:|---:|---:|---:|
| 1280 | 0 CSS px | 1,338% | 0,157% | 2,647% |
| 1440 | 0 CSS px | 1,337% | 0,157% | 2,647% |
| 1620 | 0 CSS px | 3,140% | 0,137% | 6,857% |
| 1920 | 0 CSS px | 2,676% | 0,135% | 6,987% |

Phép so pixel là so RGB thô trong hình chữ nhật phần sản phẩm, không phải phần trăm tương đồng thiết kế. Nó vẫn tính chênh lệch raster tại vị trí nửa pixel khi cuộn, viền/icon dựng bằng CSS và gradient. Không dùng ngưỡng này để tuyên bố khớp pixel 100%. Tọa độ section sau khi căn cuộn có thể lệch tới nửa CSS pixel vì scrollY được làm tròn; ảnh/diff vẫn lưu nguyên trạng.

Điều chỉnh từ lần đo trong plan: nguồn tải lại tại ≥1620 hiển thị 4 nhóm mua kèm (3 nhóm dưới 1620). Gallery nguồn dùng chiều rộng client làm tròn; CSS `round()` tái tạo quy tắc này, có fallback chuẩn cho browser chưa hỗ trợ. Cả container, gallery, thumbnail, combo, giá/cấu hình/khuyến mãi/CTA, mô tả, thông số và section tương tự đều khớp số đo trong bộ evidence cuối.

## Kiểm chứng

- `npm run build`: đạt; chỉ đọc snapshot, không gọi collector hoặc mạng.
- `npm test`: 39/39 đạt, gồm tính toàn vẹn dữ liệu/ảnh, một shell chung, phạm vi demo và link ở depth 0/1/2.
- `npm run check`: không lỗi tham chiếu local; 8 trang public.
- `npm run check:http`: 252 file public hợp lệ; 0 lỗi MIME/gzip/nội dung/alias. Snapshot, template và file nguồn không được preview phục vụ.
- Browser ở 390/768/1024: scrollWidth không vượt viewport, CTA vừa cột, bảng một cột, không sticky bảng.
- Bấm upgrade/số lượng/gallery/đặt hàng: toast hiện; giá, ảnh, số lượng và lựa chọn không đổi. Trang không có iframe hay mã checkgame.

Evidence: `product-detail-measurements.json`, `product-detail-pixel-comparison.json`, ảnh `screenshots/pd-source-*`, `pd-local-*`, `pd-diff-*`, `pd-overlay-*` và ảnh mobile. Chạy `node scripts/compare-product.mjs` để tạo lại diff từ bộ ảnh/JSON đã lưu; script này không điều khiển browser.

## Build và tái sử dụng

`npm run build:product` tạo HTML của slug từ snapshot; pipeline đầy đủ đã thêm bước này trước build CSS. CSS mới nằm trong `css/product-detail.input.css`, chỉ dùng selector pd/product-detail và phát hành chung `site.min.css`. Class của fragment đã làm sạch được scan từ `scripts/templates/pages/product/snapshot-classes.txt`.

Collector `scripts/collect-product.mjs` chỉ chạy khi cập nhật nguồn, yêu cầu JSON DOM đã tải đủ từ Chrome DevTools. Nó từ chối nguồn sai, thiếu dữ liệu/placeholder hoặc ảnh lỗi; làm sạch script/handler/integration rồi tải ảnh gốc và tái sử dụng asset có bytes trùng. Không đưa collector vào build thường. Khi phát hành cần thêm thư mục slug và giữ toàn bộ image/fonts/js/css public như README.
