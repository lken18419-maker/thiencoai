/* =============================================
   CHIÊM TINH TÂY PHƯƠNG (Sun / Moon / Rising) — module ĐỘC LẬP,
   không phụ thuộc script.js (theo đúng khuôn numerology-engine.js)
   vì đây là toán thiên văn MỚI, dễ sai — cần chạy được node --test
   thật (xem western-astrology.test.js), không chỉ kiểm bằng mắt.

   Độ chính xác — khai báo rõ để không đánh lừa người dùng:
   - Sun sign: chỉ cần ngày sinh, chính xác theo định nghĩa cung
     hoàng đạo nhiệt đới (mốc 0°=Xuân Phân), duy nhất rủi ro là
     ngày sinh đúng vào ngày chuyển cung (~1 ngày/năm mỗi cung).
   - Moon sign: dùng công thức Mặt Trăng rút gọn (Montenbruck &
     Pfleger, sai số ~0.3-1°) — đủ dùng ở mức "cung nào", rủi ro
     sai chỉ xảy ra khi sinh gần đúng lúc Mặt Trăng đổi cung.
   - Rising (Cung Mọc): Ascendant trôi ~15°/giờ, mà giờ sinh trên
     form chỉ biết theo khung Chi rộng 2 tiếng (~30° trôi, đúng 1
     cung tròn) — nên KHÔNG chọn 1 cung ở điểm giữa khung giờ, mà
     tính ở CẢ 2 đầu mút khung giờ; nếu khác cung thì trả về CẢ 2
     cung khả dĩ thay vì 1 cung với ghi chú mờ nhạt.
   ============================================= */

const ZODIAC_SIGNS = [
  'Bạch Dương', 'Kim Ngưu', 'Song Tử', 'Cự Giải', 'Sư Tử', 'Xử Nữ',
  'Thiên Bình', 'Bọ Cạp', 'Nhân Mã', 'Ma Kết', 'Bảo Bình', 'Song Ngư'
];

// Khung giờ Chi theo giờ địa phương Việt Nam (UTC+7) — Tý dùng thang 23-25 để
// khung giờ tràn qua nửa đêm vẫn cộng đúng vào phân số ngày Julius liên tục.
const CHI_HOUR_WINDOWS = {
  'Tý': [23, 25], 'Sửu': [1, 3], 'Dần': [3, 5], 'Mão': [5, 7], 'Thìn': [7, 9], 'Tỵ': [9, 11],
  'Ngọ': [11, 13], 'Mùi': [13, 15], 'Thân': [15, 17], 'Dậu': [17, 19], 'Tuất': [19, 21], 'Hợi': [21, 23]
};

// ~15 tỉnh/thành lớn — tọa độ cố định, KHÔNG geocoding (chưa có ai chọn ngoài
// danh sách này thì mặc định Hà Nội). Việt Nam chỉ 1 múi giờ (UTC+7).
const VN_CITY_COORDS = {
  'Hà Nội': { lat: 21.0285, lon: 105.8542 },
  'TP. Hồ Chí Minh': { lat: 10.7769, lon: 106.7009 },
  'Đà Nẵng': { lat: 16.0544, lon: 108.2022 },
  'Hải Phòng': { lat: 20.8449, lon: 106.6881 },
  'Cần Thơ': { lat: 10.0452, lon: 105.7469 },
  'Huế': { lat: 16.4637, lon: 107.5909 },
  'Nha Trang': { lat: 12.2388, lon: 109.1967 },
  'Vũng Tàu': { lat: 10.3460, lon: 107.0843 },
  'Biên Hòa': { lat: 10.9574, lon: 106.8426 },
  'Buôn Ma Thuột': { lat: 12.6667, lon: 108.0500 },
  'Đà Lạt': { lat: 11.9404, lon: 108.4583 },
  'Quy Nhơn': { lat: 13.7830, lon: 109.2196 },
  'Nam Định': { lat: 20.4388, lon: 106.1621 },
  'Vinh': { lat: 18.6733, lon: 105.6922 },
  'Thanh Hóa': { lat: 19.8067, lon: 105.7852 }
};
const VN_TZ = 7;

function norm360(deg) { return ((deg % 360) + 360) % 360; }
const DR = Math.PI / 180;

function jdFromDate(dd, mm, yy) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  return jd;
}

// JD đầy đủ (có phần thập phân giờ) từ ngày dương lịch + giờ địa phương (VN, UTC+7).
// JDN chuẩn quy ước là JD tại 12:00 UT của ngày đó, nên: JD = JDN + (UT_giờ - 12) / 24.
function jdFromDateTime(dd, mm, yy, localHour, tz) {
  const jdn = jdFromDate(dd, mm, yy);
  const utHour = localHour - tz;
  return jdn + (utHour - 12) / 24;
}

// Kinh độ mặt trời (độ) — cùng thuật toán công khai đã dùng trong script.js
// (Hồ Ngọc Đức / thiên văn cơ bản), chép lại tại đây để module độc lập, test được.
function sunLongitudeDeg(jd) {
  const T = (jd - 2451545.0) / 36525;
  const T2 = T * T;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(DR * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(DR * 2 * M) + 0.000290 * Math.sin(DR * 3 * M);
  return norm360(L0 + DL);
}

// Kinh độ Mặt Trăng (độ) — công thức rút gọn Montenbruck & Pfleger (sai số ~0.3-1°),
// đủ dùng để xác định "cung nào", không dùng để tính góc chính xác.
function moonLongitudeDeg(jd) {
  const T = (jd - 2451545.0) / 36525;
  const Lp = norm360(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D = norm360(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  const M = norm360(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  const Mp = norm360(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  const F = norm360(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);
  const s = deg => Math.sin(deg * DR);
  const corr =
    6.289 * s(Mp) - 1.274 * s(2 * D - Mp) + 0.658 * s(2 * D) - 0.186 * s(M)
    - 0.059 * s(2 * D - 2 * Mp) - 0.057 * s(2 * D - M - Mp) + 0.053 * s(2 * D + Mp)
    + 0.046 * s(2 * D - M) + 0.041 * s(Mp - M) - 0.035 * s(D) - 0.031 * s(Mp + M)
    - 0.015 * s(2 * F - 2 * D) + 0.011 * s(Mp - 4 * D);
  return norm360(Lp + corr);
}

function signOfLongitude(lonDeg) {
  return ZODIAC_SIGNS[Math.floor(norm360(lonDeg) / 30)];
}

// Ascendant (độ) tại 1 thời điểm (jd) + vị trí (lat/lon, độ, đông dương/bắc dương).
function ascendantDeg(jd, lat, lon) {
  const T = (jd - 2451545.0) / 36525;
  const gmst = norm360(280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T);
  const ramc = norm360(gmst + lon);
  const eps = 23.439291 - 0.0130042 * T;
  const ramcR = ramc * DR, epsR = eps * DR, latR = lat * DR;
  const y = Math.cos(ramcR);
  const x = -(Math.sin(ramcR) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR));
  return norm360(Math.atan2(y, x) / DR);
}

function sunSign(birthdate) {
  const d = new Date(birthdate + 'T00:00:00');
  const jd = jdFromDate(d.getDate(), d.getMonth() + 1, d.getFullYear());
  return signOfLongitude(sunLongitudeDeg(jd));
}

function moonSign(birthdate, birthtime) {
  const d = new Date(birthdate + 'T00:00:00');
  const win = CHI_HOUR_WINDOWS[birthtime];
  const midHour = win ? (win[0] + win[1]) / 2 : 12;
  const jd = jdFromDateTime(d.getDate(), d.getMonth() + 1, d.getFullYear(), midHour, VN_TZ);
  return signOfLongitude(moonLongitudeDeg(jd));
}

// Trả { signs: [1 hoặc 2 cung], uncertain: bool } — tính Ascendant ở CẢ 2 đầu mút
// khung giờ Chi thay vì điểm giữa, vì Ascendant trôi ~30° (1 cung) trong 2 tiếng.
function risingSigns(birthdate, birthtime, cityName) {
  const d = new Date(birthdate + 'T00:00:00');
  const win = CHI_HOUR_WINDOWS[birthtime];
  if (!win) return { signs: [], uncertain: false };
  const city = VN_CITY_COORDS[cityName] || VN_CITY_COORDS['Hà Nội'];
  const jdStart = jdFromDateTime(d.getDate(), d.getMonth() + 1, d.getFullYear(), win[0], VN_TZ);
  const jdEnd = jdFromDateTime(d.getDate(), d.getMonth() + 1, d.getFullYear(), win[1], VN_TZ);
  const signStart = signOfLongitude(ascendantDeg(jdStart, city.lat, city.lon));
  const signEnd = signOfLongitude(ascendantDeg(jdEnd, city.lat, city.lon));
  return signStart === signEnd ? { signs: [signStart], uncertain: false } : { signs: [signStart, signEnd], uncertain: true };
}

// Chọn tỉnh/thành khớp nhất bằng so khớp chuỗi con với địa điểm khách đã gõ tự do.
function matchCityFromText(text) {
  if (!text) return 'Hà Nội';
  const norm = s => s.normalize('NFC').toLowerCase();
  const t = norm(text);
  for (const city of Object.keys(VN_CITY_COORDS)) {
    if (t.includes(norm(city).replace('tp. ', ''))) return city;
  }
  return 'Hà Nội';
}

const ZODIAC_MEANINGS = {
  'Bạch Dương': { label: 'Bạch Dương (Aries)', overview: 'Năng động, quyết đoán, thích dẫn đầu và không ngại thử thách mới.', career: 'Hợp vai trò tiên phong, khởi nghiệp, cạnh tranh trực tiếp.', love: 'Nhiệt tình, chủ động, đôi khi nóng vội trong tình cảm.', challenge: 'Cần rèn tính kiên nhẫn, tránh hành động bốc đồng.' },
  'Kim Ngưu': { label: 'Kim Ngưu (Taurus)', overview: 'Kiên định, thực tế, coi trọng sự ổn định và tận hưởng cuộc sống.', career: 'Hợp các ngành cần sự bền bỉ: tài chính, ẩm thực, nghệ thuật, bất động sản.', love: 'Chung thủy, chăm sóc chu đáo, nhưng có thể cứng đầu.', challenge: 'Cần cởi mở hơn với thay đổi, tránh quá cố chấp.' },
  'Song Tử': { label: 'Song Tử (Gemini)', overview: 'Ham học hỏi, giao tiếp tốt, tư duy nhanh nhạy và linh hoạt.', career: 'Hợp truyền thông, giáo dục, kinh doanh, các công việc cần đa nhiệm.', love: 'Vui vẻ, hấp dẫn, nhưng dễ thay đổi cảm xúc.', challenge: 'Cần tập trung hoàn thành thay vì nhảy từ việc này sang việc khác.' },
  'Cự Giải': { label: 'Cự Giải (Cancer)', overview: 'Giàu tình cảm, gắn bó gia đình, trực giác nhạy bén.', career: 'Hợp các ngành chăm sóc, giáo dục, ẩm thực, bất động sản gia đình.', love: 'Sâu sắc, chân thành, đôi khi quá nhạy cảm.', challenge: 'Cần học cách không giữ cảm xúc tiêu cực quá lâu trong lòng.' },
  'Sư Tử': { label: 'Sư Tử (Leo)', overview: 'Tự tin, hào phóng, thích được công nhận và tỏa sáng.', career: 'Hợp vai trò lãnh đạo, giải trí, kinh doanh, sáng tạo nội dung.', love: 'Nồng nhiệt, hết lòng, nhưng cần được chú ý nhiều.', challenge: 'Cần tiết chế cái tôi, biết lắng nghe người khác hơn.' },
  'Xử Nữ': { label: 'Xử Nữ (Virgo)', overview: 'Tỉ mỉ, cầu toàn, có tư duy phân tích và tinh thần trách nhiệm cao.', career: 'Hợp các ngành cần độ chính xác: phân tích, y tế, tài chính, biên tập.', love: 'Chu đáo, thực tế, nhưng dễ khó tính với đối phương.', challenge: 'Cần bớt khắt khe với bản thân và người khác.' },
  'Thiên Bình': { label: 'Thiên Bình (Libra)', overview: 'Hòa nhã, coi trọng công bằng và các mối quan hệ hài hòa.', career: 'Hợp ngoại giao, luật, tư vấn, thiết kế, các vai trò cần cân bằng lợi ích.', love: 'Lãng mạn, biết chiều lòng đối phương, nhưng dễ thiếu quyết đoán.', challenge: 'Cần học cách ra quyết định dứt khoát hơn.' },
  'Bọ Cạp': { label: 'Bọ Cạp (Scorpio)', overview: 'Mãnh liệt, sâu sắc, có ý chí mạnh mẽ và trực giác sắc bén.', career: 'Hợp nghiên cứu, điều tra, tâm lý, tài chính, các lĩnh vực cần chiều sâu.', love: 'Nồng nàn, chung thủy tuyệt đối nhưng cũng dễ ghen tuông.', challenge: 'Cần học cách tin tưởng và buông bỏ kiểm soát.' },
  'Nhân Mã': { label: 'Nhân Mã (Sagittarius)', overview: 'Phóng khoáng, ham khám phá, lạc quan và yêu tự do.', career: 'Hợp du lịch, giáo dục, xuất bản, kinh doanh quốc tế.', love: 'Vui vẻ, chân thành, nhưng ngại ràng buộc lâu dài.', challenge: 'Cần rèn tính kiên định, tránh bỏ dở giữa chừng.' },
  'Ma Kết': { label: 'Ma Kết (Capricorn)', overview: 'Kỷ luật, kiên trì, có tham vọng và tư duy thực tế dài hạn.', career: 'Hợp quản lý, tài chính, xây dựng, các vai trò cần chiến lược dài hạn.', love: 'Nghiêm túc, đáng tin cậy, nhưng chậm mở lòng.', challenge: 'Cần cân bằng công việc với đời sống cảm xúc.' },
  'Bảo Bình': { label: 'Bảo Bình (Aquarius)', overview: 'Độc lập, sáng tạo, tư duy khác biệt và quan tâm đến cộng đồng.', career: 'Hợp công nghệ, khoa học, hoạt động xã hội, các ý tưởng đột phá.', love: 'Tôn trọng không gian riêng của đối phương, đôi khi hơi xa cách.', challenge: 'Cần kết nối cảm xúc nhiều hơn, tránh quá lý trí.' },
  'Song Ngư': { label: 'Song Ngư (Pisces)', overview: 'Nhạy cảm, giàu trí tưởng tượng, giàu lòng trắc ẩn.', career: 'Hợp nghệ thuật, âm nhạc, chăm sóc sức khỏe, công tác xã hội.', love: 'Lãng mạn, hy sinh vì người mình yêu, nhưng dễ mơ mộng viển vông.', challenge: 'Cần thực tế hơn, tránh trốn tránh vấn đề bằng ảo tưởng.' }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ZODIAC_SIGNS, ZODIAC_MEANINGS, VN_CITY_COORDS, CHI_HOUR_WINDOWS,
    jdFromDate, jdFromDateTime, sunLongitudeDeg, moonLongitudeDeg, ascendantDeg, signOfLongitude,
    sunSign, moonSign, risingSigns, matchCityFromText
  };
}
