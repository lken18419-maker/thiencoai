import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// ============================================================
// Nhận thông báo "biến động số dư" được forward từ điện thoại
// (app MacroDroid / SMS Forwarder bắt thông báo app ngân hàng cá
// nhân rồi POST nguyên văn nội dung tới đây) → tách order_code +
// số tiền → nếu khớp đơn "pending" trong subscriptions thì tự
// chuyển sang "paid". Miễn phí, không qua dịch vụ trung gian.
//
// Deploy với --no-verify-jwt (xem HUONG_DAN_DEPLOY.md) vì điện
// thoại forward không tạo được Supabase JWT — tự kiểm tra quyền
// bằng secret riêng (BANK_WEBHOOK_SECRET) thay cho JWT.
// ============================================================

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, x-webhook-secret',
};

const WEBHOOK_SECRET       = Deno.env.get('BANK_WEBHOOK_SECRET') ?? '';
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

// Mã đơn luôn có dạng TCA + 6 chữ số (xem createPaymentUrl trong script.js)
function extractOrderCode(text: string): string | null {
  const m = text.match(/TCA\d{6}/i);
  return m ? m[0].toUpperCase() : null;
}

// Định dạng thông báo mỗi ngân hàng một khác — thử vài kiểu phổ biến,
// ưu tiên số đi kèm đơn vị tiền tệ hoặc dấu "+" (báo có tiền vào).
function extractAmount(text: string): number | null {
  const withUnit = text.match(/\+?\s?([\d.,]{4,})\s?(?:vnd|đ|vnđ)/i);
  if (withUnit) {
    const n = Number(withUnit[1].replace(/[.,]/g, ''));
    if (Number.isFinite(n) && n > 0) return n;
  }
  const grouped = [...text.matchAll(/\d{1,3}(?:[.,]\d{3})+/g)].map(m => Number(m[0].replace(/[.,]/g, '')));
  if (grouped.length) return Math.max(...grouped);
  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  if (!WEBHOOK_SECRET || req.headers.get('x-webhook-secret') !== WEBHOOK_SECRET) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return json({ ok: false, error: 'server_not_configured' }, 500);
  }

  let text = '';
  try {
    const body = await req.json();
    text = String(body?.text ?? '');
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }
  if (!text) return json({ ok: false, error: 'empty_text' }, 400);

  const orderCode = extractOrderCode(text);
  if (!orderCode) return json({ ok: false, error: 'order_code_not_found' }, 200);

  const amount = extractAmount(text);

  const restHeaders = {
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  // Tìm đúng đơn đang "pending" theo order_code
  const findRes = await fetch(
    `${SUPABASE_URL}/rest/v1/subscriptions?order_code=eq.${orderCode}&status=eq.pending&select=id,amount`,
    { headers: restHeaders }
  );
  const rows = await findRes.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return json({ ok: false, error: 'order_not_found_or_not_pending', orderCode }, 200);
  }
  const order = rows[0];

  // Số tiền chuyển phải đủ (cho phép sai số nhỏ do làm tròn) — nếu không
  // tách được số tiền từ thông báo thì vẫn khớp theo order_code, không chặn.
  if (amount !== null && amount < Number(order.amount) - 1000) {
    return json({ ok: false, error: 'amount_mismatch', orderCode, expected: order.amount, got: amount }, 200);
  }

  const updateRes = await fetch(
    `${SUPABASE_URL}/rest/v1/subscriptions?id=eq.${order.id}`,
    { method: 'PATCH', headers: { ...restHeaders, Prefer: 'return=minimal' }, body: JSON.stringify({ status: 'paid' }) }
  );
  if (!updateRes.ok) {
    return json({ ok: false, error: 'update_failed', detail: await updateRes.text() }, 500);
  }

  return json({ ok: true, orderCode, amount });
});
