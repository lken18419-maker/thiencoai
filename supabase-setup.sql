-- ============================================================
-- Thiên Cơ AI — Supabase Setup SQL
-- Chạy file này trong: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Bảng đăng ký gói trả phí (Chuyên Sâu / Chuyên Gia)
create table if not exists subscriptions (
  id             uuid primary key default gen_random_uuid(),
  order_code     text unique not null,
  name           text not null,
  phone          text not null,
  email          text,
  plan           text not null,          -- 'Chuyên Sâu' | 'Chuyên Gia'
  billing_cycle  text not null,          -- 'monthly' | 'yearly'
  amount         numeric not null,
  payment_method text,                   -- 'momo' | 'vnpay' | 'transfer'
  status         text default 'pending', -- 'pending' | 'paid' | 'failed'
  payload        jsonb,                  -- Gói thần số học: {name, birthdate}. Gói tử vi: {name, birthdate, birthtime, birthplace, gender} — dùng để tính lại đúng báo cáo khi đơn được duyệt (xem tra-cuu-don-hang.html)
  created_at     timestamptz default now()
);

-- Đơn tạo trước khi có cột payload (nếu bảng đã tồn tại) sẽ không có cột này —
-- chạy dòng dưới nếu bạn nâng cấp từ bản cũ, bỏ qua nếu vừa tạo bảng lần đầu:
-- alter table subscriptions add column if not exists payload jsonb;

alter table subscriptions enable row level security;

drop policy if exists "Tạo đăng ký gói mới"      on subscriptions;
drop policy if exists "Xem đăng ký gói (anon)"    on subscriptions;
drop policy if exists "Cập nhật trạng thái đăng ký" on subscriptions;

create policy "Tạo đăng ký gói mới"
  on subscriptions for insert to anon with check (true);
create policy "Xem đăng ký gói (anon)"
  on subscriptions for select to anon using (true);
create policy "Cập nhật trạng thái đăng ký"
  on subscriptions for update to anon using (true);

-- ============================================================
-- Xem dữ liệu: Supabase Dashboard → Table Editor → subscriptions
-- Mỗi lượt bấm "Nâng cấp ngay" / "Đăng ký ngay" trên trang sẽ
-- tạo 1 dòng ở đây với status = 'pending' cho tới khi được xác nhận.
-- ============================================================

-- 2. Bảng liên hệ (form "Liên hệ với chúng tôi")
create table if not exists contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  topic      text,
  message    text,
  status     text default 'new', -- 'new' | 'replied' | 'closed'
  created_at timestamptz default now()
);

alter table contacts enable row level security;

drop policy if exists "Gửi liên hệ mới"      on contacts;
drop policy if exists "Xem liên hệ (anon)"    on contacts;
drop policy if exists "Cập nhật trạng thái liên hệ" on contacts;

create policy "Gửi liên hệ mới"
  on contacts for insert to anon with check (true);
create policy "Xem liên hệ (anon)"
  on contacts for select to anon using (true);
create policy "Cập nhật trạng thái liên hệ"
  on contacts for update to anon using (true);

-- ============================================================
-- Trang quản trị: mở admin.html (đổi ADMIN_PASSWORD trong file
-- trước khi deploy công khai) để xem & cập nhật trạng thái của
-- cả 2 bảng subscriptions và contacts.
-- ============================================================

-- ============================================================
-- Luồng thanh toán CHUYỂN KHOẢN NGÂN HÀNG (áp dụng cho cả gói
-- thần số học lẫn gói tử vi trả phí):
-- 1. Khách chọn "Chuyển khoản" ở checkout → 1 dòng được tạo ở
--    subscriptions với status = 'pending' và payload tương ứng
--    (dùng để tính lại đúng báo cáo của khách sau này).
-- 2. Khách chuyển khoản theo QR/số tài khoản hiển thị, nội dung CK
--    = order_code (vd: TCA123456).
-- 3. Bạn kiểm tra app ngân hàng, thấy đúng nội dung → vào admin.html,
--    đổi trạng thái đơn đó sang "Đã thanh toán".
-- 4. Khách quay lại tra-cuu-don-hang.html, nhập mã đơn → nếu đã
--    "paid": gói thần số học cho tải file PDF ngay tại đó; gói tử vi
--    đưa khách về index.html?tuvi_order=<mã đơn> để tự dựng báo cáo
--    chi tiết (dùng engine tử vi có sẵn ở trang chủ).
-- ============================================================
