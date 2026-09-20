/* =============================================
   UNIT TEST cho numerology-engine.js
   Chạy bằng: node --test numerology-engine.test.js
   (dùng test runner có sẵn trong Node.js >= 18, không cần cài thêm gì)

   Các case dưới đây đã được tính tay và đối chiếu lại nhiều lần
   trong quá trình xây dựng tính năng — dùng làm bài test hồi quy
   (regression test) để đảm bảo không vô tình làm sai công thức khi sửa code.
   ============================================= */

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  computeNumerology, reduceNumber, reduceToSingle, digitsSum,
  stripDiacritics, nameToLetters, sumLetterValues, modeOf,
  NUMEROLOGY_CONTENT_DETAILED
} = require('./numerology-engine.js');

test('digitsSum: cộng đúng tổng các chữ số', () => {
  assert.equal(digitsSum(1992), 21); // 1+9+9+2
  assert.equal(digitsSum(7), 7);
  assert.equal(digitsSum(0), 0);
});

test('reduceNumber: rút gọn về 1 chữ số, GIỮ số Master 11/22/33', () => {
  assert.equal(reduceNumber(38), 11); // 3+8=11 -> dừng vì là Master
  assert.equal(reduceNumber(48), 3);  // 4+8=12 -> 1+2=3 (12 không phải Master)
  assert.equal(reduceNumber(22), 22); // đã là Master, giữ nguyên
  assert.equal(reduceNumber(9), 9);
});

test('reduceToSingle: luôn rút gọn về đúng 1 chữ số, KHÔNG giữ Master', () => {
  assert.equal(reduceToSingle(38), 2); // 3+8=11 -> 1+1=2 (không dừng ở 11)
  assert.equal(reduceToSingle(9), 9);
});

test('stripDiacritics: bỏ dấu tiếng Việt đúng, xử lý riêng đ/Đ', () => {
  assert.equal(stripDiacritics('Đặng Bảo Ngọc'), 'Dang Bao Ngoc');
  assert.equal(stripDiacritics('Nguyễn Văn An'), 'Nguyen Van An');
});

test('nameToLetters: chuẩn hóa tên thành mảng chữ cái thường a-z', () => {
  assert.deepEqual(nameToLetters('Đặng Bảo Ngọc'), ['d','a','n','g','b','a','o','n','g','o','c']);
});

test('modeOf: tìm số xuất hiện nhiều nhất trong mảng', () => {
  assert.equal(modeOf([1, 2, 2, 3, 2]), 2);
  assert.equal(modeOf([5]), 5);
});

test('computeNumerology — case: Nguyễn Văn An, 1995-08-20', () => {
  const r = computeNumerology('Nguyễn Văn An', '1995-08-20');
  assert.equal(r.lifePath, 7);
  assert.equal(r.expression, 3);
  assert.equal(r.soulUrge, 1);
  assert.equal(r.personality, 11); // số Master được giữ nguyên
  assert.equal(r.attitude, 1);
  assert.equal(r.maturity, 1);
  assert.equal(r.birthdayNumber, 2); // ngày 20 -> 2+0=2
  assert.deepEqual(r.challenges, [6, 4, 2, 2]);
  assert.equal(r.karmicDebts.length, 0); // trường hợp này không có Nợ Nghiệp
});

test('computeNumerology — case: Đặng Bảo Ngọc, 1992-09-06', () => {
  const r = computeNumerology('Đặng Bảo Ngọc', '1992-09-06');
  assert.equal(r.lifePath, 9);
  assert.equal(r.expression, 11);
  assert.equal(r.soulUrge, 5);
  assert.equal(r.personality, 33); // số Master được giữ nguyên
  assert.equal(r.attitude, 6);
  assert.equal(r.maturity, 2);
  assert.equal(r.birthdayNumber, 6); // ngày 06 -> 6

  // Số Nợ Nghiệp: Số Linh Hồn có tổng thô đi qua 14 trước khi rút gọn về 5
  const soulUrgeKarmic = r.karmicDebts.find(k => k.label === 'Số Linh Hồn');
  assert.ok(soulUrgeKarmic, 'phải phát hiện Nợ Nghiệp ở Số Linh Hồn');
  assert.equal(soulUrgeKarmic.num, 14);

  // 4 Đỉnh Cao (Kim Tự Tháp): tính từ 3 số chân đế tháng=9, ngày=6, năm rút gọn=3
  const pinnacleNums = r.pinnacles.map(p => p.num);
  assert.deepEqual(pinnacleNums, [6, 9, 6, 3]);
  assert.equal(r.pinnacles[0].ageEnd, 27); // 36 - lifePath(9) = 27
  assert.equal(r.pinnacles[1].ageStart, 28);
  assert.equal(r.pinnacles[1].ageEnd, 36); // +9
  assert.equal(r.pinnacles[3].ageEnd, null); // Đỉnh 4 kéo dài tới hết đời

  // Phân tích 60 năm: đúng 6 thập kỷ x 10 năm, năm sinh phải là năm đầu tiên
  assert.equal(r.sixtyYearLife.length, 6);
  assert.equal(r.sixtyYearLife[0].years.length, 10);
  assert.equal(r.sixtyYearLife[0].years[0].year, 1992);
  assert.equal(r.sixtyYearLife[0].years[0].py, 9); // đã đối chiếu tay trước đó
});

test('NUMEROLOGY_CONTENT_DETAILED (Module 2) — đủ cả 12 số, đúng schema 5 phần', () => {
  const ALL_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
  const filledNumbers = Object.entries(NUMEROLOGY_CONTENT_DETAILED).filter(([, v]) => v !== null);
  assert.deepEqual(
    filledNumbers.map(([k]) => Number(k)).sort((a, b) => a - b),
    ALL_NUMBERS
  );

  for (const [num, content] of filledNumbers) {
    assert.ok(Array.isArray(content.coreMeaning) && content.coreMeaning.length >= 2,
      `Số ${num}: coreMeaning phải có ít nhất 2 đoạn`);
    assert.ok(Array.isArray(content.strengths) && content.strengths.length > 0,
      `Số ${num}: phải có strengths`);
    assert.ok(Array.isArray(content.weaknesses) && content.weaknesses.length > 0,
      `Số ${num}: phải có weaknesses cụ thể`);
    assert.ok(Array.isArray(content.improvementChecklist) && content.improvementChecklist.length > 0,
      `Số ${num}: phải có improvementChecklist`);
    assert.ok(typeof content.career === 'string' && content.career.length > 0,
      `Số ${num}: phải có gợi ý career`);
    assert.ok(typeof content.love === 'string' && content.love.length > 0,
      `Số ${num}: phải có gợi ý love`);
    assert.ok(typeof content.finance === 'string' && content.finance.length > 0,
      `Số ${num}: phải có gợi ý finance`);
  }
});
