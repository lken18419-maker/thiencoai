import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const PARTNER_CODE = Deno.env.get('MOMO_PARTNER_CODE') ?? 'MOMO';
const ACCESS_KEY   = Deno.env.get('MOMO_ACCESS_KEY')   ?? 'F8BBA842ECF85';
const SECRET_KEY   = Deno.env.get('MOMO_SECRET_KEY')   ?? 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const ENDPOINT     = Deno.env.get('MOMO_ENDPOINT')     ?? 'https://test-payment.momo.vn';
const SITE_URL     = Deno.env.get('SITE_URL')          ?? 'https://thiencoai.vercel.app';

async function hmacSha256(key: string, data: string): Promise<string> {
  const enc  = new TextEncoder();
  const k    = await crypto.subtle.importKey('raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig  = await crypto.subtle.sign('HMAC', k, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const { orderCode, amount, orderInfo } = await req.json();

  const requestId   = `${orderCode}_${Date.now()}`;
  const redirectUrl = `${SITE_URL}/payment-result.html?method=momo&order=${orderCode}`;
  const ipnUrl      = `${Deno.env.get('SUPABASE_URL')}/functions/v1/momo-pay`;

  const rawSig = [
    `accessKey=${ACCESS_KEY}`,
    `amount=${amount}`,
    `extraData=`,
    `ipnUrl=${ipnUrl}`,
    `orderId=${orderCode}`,
    `orderInfo=${orderInfo ?? 'Thanh toan Thien Co AI'}`,
    `partnerCode=${PARTNER_CODE}`,
    `redirectUrl=${redirectUrl}`,
    `requestId=${requestId}`,
    `requestType=payWithMethod`,
  ].join('&');

  const signature = await hmacSha256(SECRET_KEY, rawSig);

  const body = {
    partnerCode: PARTNER_CODE, accessKey: ACCESS_KEY,
    requestId, amount: Number(amount),
    orderId: orderCode,
    orderInfo: orderInfo ?? 'Thanh toan Thien Co AI',
    redirectUrl, ipnUrl,
    requestType: 'payWithMethod',
    extraData: '', lang: 'vi', signature,
  };

  const res  = await fetch(`${ENDPOINT}/v2/gateway/api/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  return new Response(JSON.stringify({
    ok:       data.resultCode === 0,
    payUrl:   data.payUrl,
    deeplink: data.deeplink,
    msg:      data.message,
  }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
});
