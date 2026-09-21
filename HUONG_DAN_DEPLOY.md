# Hướng dẫn Deploy Backend Thanh Toán — Thiên Cơ AI

Kiến trúc giống hệ thống thanh toán của "Bếp Của Mẹ": frontend tĩnh (Vercel) +
database/edge functions (Supabase) + cổng thanh toán MoMo/VNPay.

```
GitHub (code)
    │
    └── push lên main
            │
            ▼
    Vercel (hosting web)  ←→  Supabase (database)
    thiencoai.vercel.app        subscriptions
                                    │
                              Edge Functions
                              (MoMo / VNPay)
```

Hiện tại `SUPABASE_URL` và `SUPABASE_ANON_KEY` trong `script.js` đang để trống
→ khi bấm "Mở khóa gói" ở mục Bảng giá, form vẫn hoạt động (validate, hiện
màn hình xác nhận) nhưng **chưa** gọi cổng thanh toán thật hay lưu vào database.
Làm theo các bước dưới đây để kích hoạt đầy đủ.

---

## Phần 1 — Supabase (Database + Edge Functions)

### 1.1 Tạo project
1. Vào [supabase.com](https://supabase.com) → **New project**
2. Đặt tên: `thiencoai` → chọn region **Southeast Asia (Singapore)**
3. Đặt database password (lưu lại)

### 1.2 Tạo bảng
1. Vào **SQL Editor** trong dashboard Supabase
2. Copy toàn bộ nội dung file `supabase-setup.sql` → paste → nhấn **Run**
3. Kết quả: tạo bảng **subscriptions** kèm RLS policies

### 1.3 Lấy API keys
Vào **Settings → API**:

| Giá trị | Tên trường |
|---|---|
| Project URL | `https://xxxx.supabase.co` |
| anon public | key dài bắt đầu bằng `eyJ...` |

### 1.4 Gắn vào website
Mở `script.js`, tìm và điền:
```js
const SUPABASE_URL      = 'https://xxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGci...';
```

### Xem dữ liệu
- Vào **Table Editor** trong Supabase dashboard → bảng **subscriptions**:
  danh sách tất cả lượt mở khóa gói Luận Giải Toàn Bộ / Toàn Cảnh Vận Hạn / Toàn Thư Vận Mệnh.
- Bảng **contacts**: mọi lượt gửi form "Liên hệ với chúng tôi" trên trang.
- Hoặc dùng trang quản trị riêng **`admin.html`** (xem Phần 4 bên dưới) để
  xem và cập nhật trạng thái cả 2 bảng mà không cần vào Supabase dashboard.

---

## Phần 2 — Thanh toán MoMo / VNPay

> **Cập nhật:** nút "Ví MoMo" ở checkout hiện KHÔNG còn gọi cổng API MoMo nữa —
> MoMo không có cách nào nhận tiền qua API bằng số điện thoại cá nhân (bắt buộc
> phải đăng ký MoMo Business tại business.momo.vn mới dùng được cổng thật ở
> dưới). Vì vậy MoMo giờ hoạt động **giống hệt "Chuyển khoản ngân hàng"** —
> hiện hướng dẫn chuyển tay tới số điện thoại trong `MOMO_CONFIG` (script.js,
> cạnh `BANK_CONFIG`), khách tự mở app MoMo chuyển, rồi bạn duyệt đơn trong
> admin.html như chuyển khoản. Phần Edge Function `momo-pay` bên dưới chỉ còn
> ý nghĩa nếu sau này bạn đăng ký MoMo Business thật và muốn quay lại dùng cổng
> API (khi đó cần tự đổi lại code checkout để redirect qua `momo-pay` như cũ).

### 2.1 Cài Supabase CLI
```bash
npm install -g supabase
supabase login
```

### 2.2 Liên kết project
```bash
cd d:/tuvi-ai
supabase link --project-ref xxxx   # lấy ref trong URL dashboard
```

### 2.3 Thêm biến môi trường cho Edge Functions
```bash
# MoMo (lấy từ business.momo.vn sau khi đăng ký merchant)
supabase secrets set MOMO_PARTNER_CODE=your_partner_code
supabase secrets set MOMO_ACCESS_KEY=your_access_key
supabase secrets set MOMO_SECRET_KEY=your_secret_key
supabase secrets set MOMO_ENDPOINT=https://payment.momo.vn   # production

# VNPay (lấy từ vnpay.vn sau khi đăng ký merchant)
supabase secrets set VNP_TMN_CODE=your_tmn_code
supabase secrets set VNP_HASH_SECRET=your_hash_secret
supabase secrets set VNP_URL=https://pay.vnpay.vn/vpcpay.html   # production

# URL website
supabase secrets set SITE_URL=https://thiencoai.vercel.app
```

### 2.4 Deploy Edge Functions
```bash
supabase functions deploy momo-pay
supabase functions deploy vnpay-pay
```

> **Lưu ý:** Nếu bỏ qua bước 2.3, các function vẫn chạy được bằng
> **credentials sandbox mặc định** (đã set sẵn trong code) — dùng để
> test luồng redirect sang cổng MoMo/VNPay giả lập, chưa nhận tiền thật.
> Để nhận tiền thật cần đăng ký merchant tại:
> - MoMo: [business.momo.vn](https://business.momo.vn)
> - VNPay: [vnpay.vn](https://vnpay.vn) → mục đối tác

---

## Phần 2b — Tự động mở khóa khi chuyển khoản (miễn phí, không qua trung gian)

Thay vì tự vào `admin.html` đổi trạng thái từng đơn "Chuyển khoản" sang "Đã
thanh toán", có thể tự động hoá **hoàn toàn miễn phí** bằng cách forward
thông báo biến động số dư từ điện thoại tới một Edge Function tự kiểm tra
và cập nhật Supabase — không cần đăng ký dịch vụ trung gian trả phí nào.

### 2b.1 Deploy Edge Function `bank-notify`
```bash
cd d:/tuvi-ai
# --no-verify-jwt vì điện thoại forward không tạo được Supabase JWT —
# function tự kiểm tra quyền bằng secret riêng thay cho JWT của Supabase.
supabase functions deploy bank-notify --no-verify-jwt
```

### 2b.2 Đặt secret riêng (khác với các key khác, KHÔNG chia sẻ)
```bash
# Tự tạo 1 chuỗi ngẫu nhiên dài (vd bằng https://www.uuidgenerator.net) làm secret
supabase secrets set BANK_WEBHOOK_SECRET=<chuỗi-ngẫu-nhiên-của-bạn>
```
`SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` được Supabase tự cấp sẵn cho
mọi Edge Function, không cần set thêm.

Sau khi deploy, URL của function có dạng:
```
https://<project-ref>.supabase.co/functions/v1/bank-notify
```

### 2b.3 Cấu hình điện thoại forward thông báo ngân hàng
Dùng 1 điện thoại Android (có thể là máy cũ để không) luôn bật, có mạng,
đã đăng nhập app ngân hàng cá nhân của bạn và **bật thông báo push** cho
mỗi giao dịch. Cài app **MacroDroid** (miễn phí, CH Play), tạo 1 macro:

1. **Trigger**: Notification Received → chọn đúng app ngân hàng của bạn.
2. **Action**: HTTP Request
   - Method: `POST`
   - URL: `https://<project-ref>.supabase.co/functions/v1/bank-notify`
   - Headers: `Content-Type: application/json` và `x-webhook-secret: <chuỗi-ngẫu-nhiên-ở-bước-2b.2>`
   - Body (JSON), dùng biến "Notification Text" của MacroDroid:
     ```json
     {"text": "[nt_text]"}
     ```
     (tên biến chính xác tuỳ phiên bản MacroDroid — chọn trong danh sách
     "Magic Text" khi soạn Body, miễn là chèn được toàn bộ nội dung thông
     báo, ví dụ: "TK 0123xxx +100,000VND ... ND: TCA482913 ...").
3. Lưu macro, bật **Accessibility Service** khi được yêu cầu (MacroDroid
   cần quyền này để đọc nội dung thông báo).

Từ lúc này: khách chuyển khoản đúng nội dung `TCA...` hiển thị ở QR →
điện thoại nhận thông báo → MacroDroid forward → function tách mã đơn +
số tiền, khớp đúng đơn "pending" và đủ tiền thì tự chuyển "paid" → khách
vào lại `tra-cuu-don-hang.html` (hoặc trang đã mở sẵn) là thấy mở khóa
ngay, không cần bạn vào `admin.html` xác nhận thủ công nữa.

**Giới hạn cần biết:**
- Điện thoại phải luôn online và app ngân hàng phải bật thông báo — mất
  mạng/hết pin thì đơn không tự khớp cho tới khi máy kết nối lại (khi đó
  vẫn có thể vào `admin.html` xác nhận tay như bình thường, không hỏng gì).
- Định dạng thông báo khác nhau tuỳ ngân hàng; nếu ngân hàng đổi định dạng
  app, phần tách số tiền/mã đơn trong `bank-notify/index.ts` có thể cần
  chỉnh lại regex cho khớp.
- `BANK_WEBHOOK_SECRET` là thứ duy nhất chặn người khác gọi thẳng function
  này để tự đánh dấu đơn của họ là "đã thanh toán" — giữ bí mật, không
  gắn vào code phía frontend (`script.js`, `admin.html`).

---

## Phần 3 — Vercel (Hosting)

### Deploy lần đầu
```bash
cd d:/tuvi-ai
npm install -g vercel
vercel --yes
```

### Cập nhật sau này
```bash
vercel --prod
```

Hoặc kết nối GitHub repo với Vercel để tự động deploy mỗi lần `git push`
(xem file `.github/workflows/deploy.yml` của dự án Bếp Của Mẹ làm mẫu nếu
muốn thiết lập CI/CD tương tự).

---

## Phần 4 — Trang quản trị (admin.html)

`admin.html` là trang riêng (không link từ menu công khai) để xem & xử lý
đăng ký gói và liên hệ, dùng chung Supabase project với trang chính.

1. Mở `admin.html`, tìm và điền **cùng** `SUPABASE_URL` / `SUPABASE_ANON_KEY`
   đã điền ở `script.js` (Phần 1.4).
2. **Đổi mật khẩu mặc định** — tìm dòng:
   ```js
   const ADMIN_PASSWORD = 'thiencoai2026';
   ```
   Đổi thành mật khẩu riêng của bạn trước khi deploy công khai (mật khẩu
   này chỉ chặn ở phía trình duyệt, không phải xác thực máy chủ thật —
   phù hợp cho admin cá nhân/nội bộ, không dùng cho dữ liệu nhạy cảm cao).
3. Đăng nhập → xem 3 tab: **Tổng quan**, **Đăng ký gói**, **Liên hệ**.
   Đổi trạng thái (Chờ xử lý / Đã thanh toán / Thất bại, hoặc Mới / Đã
   phản hồi / Đã đóng) ngay trên bảng, tự lưu vào Supabase.

---

## Cách test ngay (chưa cần deploy)

1. Mở `index.html` bằng trình duyệt → cuộn tới **Bảng giá** (tử vi) hoặc
   **Bảng Giá Thần Số Học**.
2. Bấm **"Mở khóa gói"** / **"Nhận Ngay"** ở gói bất kỳ.
3. Điền thông tin, chọn phương thức thanh toán, bấm **"Xác Nhận Mở Khóa"**.
   - Nếu `SUPABASE_URL`/`SUPABASE_ANON_KEY` **chưa điền**: chọn **MoMo** hoặc
     **VNPay** sẽ tự động chuyển sang `payment-result.html` với trạng thái
     "Thanh toán thành công" (chế độ mô phỏng cục bộ, có ghi chú 🧪 màu vàng
     để không nhầm với cổng thật) — dùng để test toàn bộ trải nghiệm ngay mà
     không cần deploy gì cả. Chọn "Chuyển khoản" luôn hiện xác nhận tại chỗ.
   - Sau khi điền Supabase keys + deploy Edge Functions → chế độ mô phỏng tự
     tắt, chọn MoMo/VNPay sẽ **chuyển hướng thật** sang cổng thanh toán sandbox.
   - Nếu bạn đã **lập lá số miễn phí** / **tính thần số học miễn phí** trước
     đó, sau khi mở khóa thành công sẽ có nút xem ngay kết quả tương ứng —
     AI dựng báo cáo hoàn toàn tự động và miễn phí (không gọi API AI ngoài).

---

## Tóm tắt nhanh — việc cần làm để go live

- [ ] Tạo Supabase project + chạy `supabase-setup.sql`
- [ ] Điền `SUPABASE_URL` và `SUPABASE_ANON_KEY` vào `script.js`
- [ ] Điền `SUPABASE_URL` và `SUPABASE_ANON_KEY` vào `admin.html` + đổi `ADMIN_PASSWORD`
- [ ] Deploy Supabase Edge Functions (momo-pay, vnpay-pay)
- [ ] Đăng ký merchant MoMo / VNPay (để nhận thanh toán thật)
- [ ] (Tuỳ chọn, miễn phí) Deploy `bank-notify` + set `BANK_WEBHOOK_SECRET` + cấu hình MacroDroid để tự mở khóa khi chuyển khoản (Phần 2b)
- [ ] Deploy lên Vercel và cập nhật `SITE_URL` trong Supabase secrets
