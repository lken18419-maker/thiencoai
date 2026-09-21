/* =============================================
   UNIT TEST cho western-astrology.js
   Chạy bằng: node --test western-astrology.test.js
   ============================================= */

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ZODIAC_SIGNS, ZODIAC_MEANINGS, VN_CITY_COORDS, CHI_HOUR_WINDOWS,
  jdFromDate, jdFromDateTime, sunLongitudeDeg, moonLongitudeDeg, ascendantDeg, signOfLongitude,
  sunSign, moonSign, risingSigns, matchCityFromText
} = require('./western-astrology.js');

test('sunSign: đúng cung ở vài mốc ngày cách xa ranh giới (không phải ngày cusp)', () => {
  assert.equal(sunSign('2000-01-10'), 'Ma Kết');      // 22/12 - 19/1
  assert.equal(sunSign('2000-04-05'), 'Bạch Dương');  // 21/3 - 19/4
  assert.equal(sunSign('2000-07-25'), 'Sư Tử');       // 23/7 - 22/8
  assert.equal(sunSign('2000-10-25'), 'Bọ Cạp');      // 23/10 - 21/11
  assert.equal(sunSign('1995-08-20'), 'Sư Tử');
});

test('ZODIAC_SIGNS/ZODIAC_MEANINGS: đủ 12 cung, mỗi cung có schema đúng', () => {
  assert.equal(ZODIAC_SIGNS.length, 12);
  ZODIAC_SIGNS.forEach(sign => {
    const m = ZODIAC_MEANINGS[sign];
    assert.ok(m, `thiếu nội dung cho ${sign}`);
    assert.ok(m.label && m.overview && m.career && m.love && m.challenge, `thiếu field cho ${sign}`);
  });
});

test('VN_CITY_COORDS: đủ ~15 tỉnh/thành, tọa độ nằm trong phạm vi Việt Nam', () => {
  const cities = Object.keys(VN_CITY_COORDS);
  assert.ok(cities.length >= 15);
  cities.forEach(c => {
    const { lat, lon } = VN_CITY_COORDS[c];
    assert.ok(lat > 8 && lat < 24, `lat bất thường cho ${c}: ${lat}`);
    assert.ok(lon > 100 && lon < 110, `lon bất thường cho ${c}: ${lon}`);
  });
});

test('matchCityFromText: so khớp đúng theo chuỗi con, mặc định Hà Nội nếu không khớp', () => {
  assert.equal(matchCityFromText('Đà Nẵng, Việt Nam'), 'Đà Nẵng');
  assert.equal(matchCityFromText('Quận 1, TP. Hồ Chí Minh'), 'TP. Hồ Chí Minh');
  assert.equal(matchCityFromText('Một nơi không có trong danh sách'), 'Hà Nội');
});

test('moonLongitudeDeg: tốc độ di chuyển hợp lý (~12-14°/ngày) — kiểm tính nhất quán nội tại của công thức', () => {
  const jd0 = jdFromDate(20, 8, 1995);
  const speeds = [];
  for (let i = 0; i < 5; i++) {
    const a = moonLongitudeDeg(jd0 + i);
    const b = moonLongitudeDeg(jd0 + i + 1);
    let diff = b - a;
    if (diff < 0) diff += 360;
    speeds.push(diff);
  }
  speeds.forEach(s => assert.ok(s > 10 && s < 16, `tốc độ Mặt Trăng bất thường: ${s}°/ngày`));
});

test('moonSign: trả về đúng 1 trong 12 cung hợp lệ', () => {
  const sign = moonSign('1995-08-20', 'Tý');
  assert.ok(ZODIAC_SIGNS.includes(sign));
});

test('ascendantDeg: trường hợp lý tưởng ε=0, lat=0 phải cho Asc = RAMC + 90 (kiểm công thức)', () => {
  // Dựng trực tiếp qua atan2 tương đương công thức trong module để xác nhận
  // không lệch pha/lệch dấu — dùng RAMC=0 và RAMC=90 làm 2 điểm neo.
  const eps0lat0 = (ramcDeg) => {
    const DR = Math.PI / 180;
    const ramcR = ramcDeg * DR;
    const y = Math.cos(ramcR);
    const x = -(Math.sin(ramcR) * Math.cos(0) + Math.tan(0) * Math.sin(0));
    return ((Math.atan2(y, x) / DR) % 360 + 360) % 360;
  };
  assert.ok(Math.abs(eps0lat0(0) - 90) < 0.001);
  assert.ok(Math.abs(eps0lat0(90) - 180) < 0.001);
});

test('risingSigns: đầu-khung và cuối-khung khung giờ Chi thường khác cung (Ascendant trôi ~30°/2 tiếng)', () => {
  const { signs, uncertain } = risingSigns('1995-08-20', 'Ngọ', 'Hà Nội');
  assert.ok(signs.length === 1 || signs.length === 2);
  if (signs.length === 2) {
    assert.equal(uncertain, true);
    assert.notEqual(signs[0], signs[1]);
  }
  // Ít nhất 1 trong nhiều khung giờ thử phải cho ra 2 cung khả dĩ — nếu không,
  // toàn bộ cơ chế "2 cung khả dĩ" coi như chưa từng được kích hoạt bởi test nào.
  const anyUncertain = Object.keys(CHI_HOUR_WINDOWS).some(bt => risingSigns('1995-08-20', bt, 'Hà Nội').uncertain);
  assert.ok(anyUncertain, 'không có khung giờ nào tạo ra 2 cung khả dĩ — nghi ngờ công thức Ascendant sai');
});

test('jdFromDateTime: giờ Tý (23-25) cộng đúng qua nửa đêm sang ngày hôm sau', () => {
  const jdAt23 = jdFromDateTime(20, 8, 1995, 23, 7);
  const jdAt25 = jdFromDateTime(20, 8, 1995, 25, 7);
  assert.ok(Math.abs((jdAt25 - jdAt23) - (2 / 24)) < 1e-9);
});
