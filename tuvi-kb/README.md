# Tuvi Knowledge Base — 14 Chính Tinh (Module A.1)

Trạng thái: **BẢN NHÁP — chờ duyệt**, nhân rộng theo đúng schema đã duyệt ở `sao-tu-vi.json`.
Chưa gắn vào website (`tuvi-content.js` hiện tại là nội dung ĐANG chạy live, tách biệt file KB này).

## Danh sách 14 file

| File | Sao | Nhóm |
|---|---|---|
| `sao-tu-vi.json` | Tử Vi | Bắc Đẩu (vòng Tử Vi) |
| `sao-thien-co.json` | Thiên Cơ | Bắc Đẩu (vòng Tử Vi) |
| `sao-thai-duong.json` | Thái Dương | Bắc Đẩu (vòng Tử Vi) |
| `sao-vu-khuc.json` | Vũ Khúc | Bắc Đẩu (vòng Tử Vi) |
| `sao-thien-dong.json` | Thiên Đồng | Bắc Đẩu (vòng Tử Vi) |
| `sao-liem-trinh.json` | Liêm Trinh | Bắc Đẩu (vòng Tử Vi) |
| `sao-thien-phu.json` | Thiên Phủ | Nam Đẩu (vòng Thiên Phủ) |
| `sao-thai-am.json` | Thái Âm | Nam Đẩu (vòng Thiên Phủ) |
| `sao-tham-lang.json` | Tham Lang | Nam Đẩu (vòng Thiên Phủ) |
| `sao-cu-mon.json` | Cự Môn | Nam Đẩu (vòng Thiên Phủ) |
| `sao-thien-tuong.json` | Thiên Tướng | Nam Đẩu (vòng Thiên Phủ) |
| `sao-thien-luong.json` | Thiên Lương | Nam Đẩu (vòng Thiên Phủ) |
| `sao-that-sat.json` | Thất Sát | Nam Đẩu (vòng Thiên Phủ) |
| `sao-pha-quan.json` | Phá Quân | Nam Đẩu (vòng Thiên Phủ) — *xem ghi chú mâu thuẫn phân nhóm bên dưới* |

Mỗi file gồm: `tinh_chat_co_ban`, `dac_diem_tinh_cach_khi_thu_menh`, `trang_thai` (Miếu/Vượng/Đắc/Bình hòa/Hãm), `y_nghia_theo_cung` (Mệnh/Tài Bạch/Quan Lộc/Phu Thê), `to_hop_sao_di_kem`, `_do_tin_cay_va_can_bo_sung`.

## Tổng hợp GIỚI HẠN cần bạn biết trước khi dùng cho sản phẩm thật

### 1. KHÔNG có bảng Miếu/Vượng/Đắc/Bình/Hãm đầy đủ cho bất kỳ sao nào
Đã tra nhiều nguồn cho cả 14 sao. Kết quả:
- **Miếu**: tìm được cho cả 14 sao (độ tin cậy "trung bình" — mỗi sao chỉ có 1 nguồn tổng hợp, CHƯA đối chiếu chéo với nguồn thứ 2 độc lập).
- **Vượng / Đắc địa / Bình hòa**: **KHÔNG tìm được cho bất kỳ sao nào** — toàn bộ đánh dấu CẦN KIỂM TRA LẠI NGUỒN.
- **Hãm**: chỉ tìm được cho **Thiên Lương** (Tỵ, Hợi, Dậu) — 13 sao còn lại chưa có.
- Riêng **Thiên Lương** phát hiện MÂU THUẪN nội bộ: 2 bài viết khác nhau trên cùng 1 website (tracuutuvi.com) đưa ra 2 danh sách Miếu/Vượng khác nhau — cần bạn hoặc chuyên gia đối chiếu chọn 1 bản.

### 2. Thiếu ý nghĩa tại 1 số cung ưu tiên (chưa tìm được nguồn đáng tin cậy)
- Thiên Phủ: thiếu Phu Thê
- Thái Âm: thiếu Quan Lộc, Phu Thê
- Cự Môn: thiếu Quan Lộc, Phu Thê
- Thiên Lương: thiếu Quan Lộc, Phu Thê

### 3. Tổ hợp sao đi kèm — đa phần chỉ có TÊN GỌI
Các cách cục như Vũ Tham, Thiên Cơ+Cự Môn, Thiên Đồng+Thái Âm... chỉ xác nhận được tên gọi phổ biến, CHƯA có mô tả đầy đủ điều kiện hình thành/ý nghĩa từ nguồn đáng tin cậy. Ngoại lệ có mô tả khá đầy đủ: Tử Phủ đồng cung, Tử Vi+Phá Quân, Tử Vi+Tham Lang, Sát Phá Tham, Sát Phá Liêm Tham, Phủ Tướng Triều Viên.

### 4. Mâu thuẫn phân nhóm Bắc Đẩu/Nam Đẩu cho Phá Quân
Một nguồn gọi Phá Quân là "đứng thứ 7 trong chòm Bắc Đẩu", nhưng hệ thống an sao hiện tại của website (vòng Thiên Phủ, 8 sao) xếp Phá Quân vào nhóm cùng với Thiên Phủ...Thất Sát. Cần thống nhất cách gọi trước khi xuất bản công khai (không ảnh hưởng code hiện tại — trường `nhom` chỉ mang tính mô tả).

## Đề xuất

Nếu có tài liệu gốc (Tử Vi Đẩu Số Toàn Thư, bản dịch, hoặc sách trường phái cụ thể như Nguyễn Phát Lộc từng nhắc), gửi phần liên quan đến:
1. Bảng Miếu/Vượng/Đắc/Bình/Hãm đầy đủ — đây là phần thiếu nhiều nhất.
2. Các cung Quan Lộc/Phu Thê còn thiếu ở 4 sao nêu trên.
3. Xác nhận trường phái chủ đạo để chọn khi có mâu thuẫn giữa các nguồn.

Nếu không có tài liệu gốc, mình có thể tiếp tục dùng nguồn phổ thông đối chiếu chéo (như đã làm), chấp nhận các khoảng trống được đánh dấu rõ, và KHÔNG bịa số liệu — đúng nguyên tắc bạn đã đặt ra từ đầu.
