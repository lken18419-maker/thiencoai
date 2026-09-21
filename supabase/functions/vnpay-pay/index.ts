import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  // supabase-js functions.invoke() tự gắn thêm authorization/apikey/x-client-info —
  // thiếu các header này ở preflight khiến trình duyệt chặn request thật (curl vẫn
  // qua bình thường vì curl không làm CORS preflight, dễ gây nhầm là function lỗi).
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TMN_CODE    = Deno.env.get('VNP_TMN_CODE')    ?? 'DEMOV210';
const HASH_SECRET = Deno.env.get('VNP_HASH_SECRET') ?? 'QWERTY12345678901234567890123456';
const VNP_URL     = Deno.env.get('VNP_URL')         ?? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const SITE_URL    = Deno.env.get('SITE_URL')         ?? 'https://thiencoai.vercel.app';

async function hmacSha512(key: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const k   = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { orderCode, amount } = await req.json();

  // Định dạng ngày: yyyyMMddHHmmss (GMT+7)
  const now = new Date(Date.now() + 7 * 3600_000);
  const createDate = now.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);

  const params: Record<string, string> = {
    vnp_Version:   '2.1.0',
    vnp_Command:   'pay',
    vnp_TmnCode:   TMN_CODE,
    vnp_Amount:    String(Number(amount) * 100), // VNPay nhân 100
    vnp_CurrCode:  'VND',
    vnp_TxnRef:    orderCode,
    vnp_OrderInfo: `Thanh toan goi dang ky ${orderCode}`,
    vnp_OrderType: 'other',
    vnp_Locale:    'vn',
    vnp_ReturnUrl: `${SITE_URL}/payment-result.html?method=vnpay&order=${orderCode}`,
    vnp_IpAddr:    '127.0.0.1',
    vnp_CreateDate: createDate,
  };

  // Sắp xếp key theo alphabet
  const sorted = Object.fromEntries(Object.entries(params).sort(([a], [b]) => a.localeCompare(b)));
  const signData = new URLSearchParams(sorted).toString();
  const signature = await hmacSha512(HASH_SECRET, signData);
  const payUrl    = `${VNP_URL}?${signData}&vnp_SecureHash=${signature}`;

  return new Response(JSON.stringify({ ok: true, payUrl }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
});
