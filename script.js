/* =============================================
   THIÊN CƠ AI — script.js
   Navbar, form lập lá số, FAQ, pricing, contact
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initGenderToggle();
  initFaq();
  initPlanButtons();
  initCheckoutModal();
  initScrollTop();
  initFadeUp();
  initTuviForm();
  initNumerologyForm();
  initContactForm();
  initNatalCitySelect();
  checkTuviOrderFromUrl();
});

// Dropdown chọn tỉnh/thành (dùng để tính Cung Mọc chiêm tinh Tây phương, western-astrology.js)
// — tự chọn sẵn theo "Nơi sinh" đã gõ, khách có thể tự sửa lại nếu đoán sai.
function initNatalCitySelect() {
  const select = document.getElementById('natalCity');
  const birthplaceInput = document.getElementById('birthplace');
  if (!select || typeof VN_CITY_COORDS === 'undefined') return;
  select.innerHTML = Object.keys(VN_CITY_COORDS).map(c => `<option value="${c}">${c}</option>`).join('');
  select.addEventListener('change', () => { select.dataset.userChanged = '1'; });
  birthplaceInput.addEventListener('input', () => {
    if (select.dataset.userChanged) return;
    select.value = matchCityFromText(birthplaceInput.value);
  });
}

/* ===== NAVBAR SCROLL STATE ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

/* ===== GENDER TOGGLE ===== */
function initGenderToggle() {
  const btns = document.querySelectorAll('.gender-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/* ===== FAQ ACCORDION ===== */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ===== PLAN BUTTONS ===== */
function initPlanButtons() {
  document.querySelectorAll('.btn-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      if (plan === 'Miễn Phí') {
        document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
        return;
      }
      openCheckoutModal(plan);
    });
  });
}

/* ===== SCROLL TO TOP ===== */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===== FADE-UP ON SCROLL ===== */
function initFadeUp() {
  const items = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => observer.observe(item));
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    if (_sb) {
      try {
        await _sb.from('contacts').insert({
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          phone: form.phone.value.trim(),
          topic: form.topic.value,
          message: form.message.value.trim(),
          status: 'new'
        });
      } catch { /* vẫn hiện thành công nếu bảng chưa được tạo, tránh chặn người dùng */ }
    }

    if (submitBtn) submitBtn.disabled = false;
    form.style.display = 'none';
    success.style.display = 'block';
  });
}

/* =============================================
   TỬ VI ENGINE (mock, dựa trên Can Chi + Nạp Âm thật)
   ============================================= */

const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// 60 Hoa Giáp -> Nạp Âm Ngũ Hành (chuẩn cổ truyền), index = (year - 4) % 60
const NAP_AM = [
  'Hải Trung Kim', 'Hải Trung Kim', 'Lư Trung Hỏa', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Đại Lâm Mộc',
  'Lộ Bàng Thổ', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', 'Kiếm Phong Kim', 'Sơn Đầu Hỏa', 'Sơn Đầu Hỏa',
  'Giản Hạ Thủy', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Bạch Lạp Kim',
  'Dương Liễu Mộc', 'Dương Liễu Mộc', 'Tuyền Trung Thủy', 'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Ốc Thượng Thổ',
  'Tích Lịch Hỏa', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Tùng Bách Mộc', 'Trường Lưu Thủy', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bình Địa Mộc',
  'Bích Thượng Thổ', 'Bích Thượng Thổ', 'Kim Bạch Kim', 'Kim Bạch Kim', 'Phú Đăng Hỏa', 'Phú Đăng Hỏa',
  'Thiên Hà Thủy', 'Thiên Hà Thủy', 'Đại Trạch Thổ', 'Đại Trạch Thổ', 'Thoa Xuyến Kim', 'Thoa Xuyến Kim',
  'Tang Đố Mộc', 'Tang Đố Mộc', 'Đại Khê Thủy', 'Đại Khê Thủy', 'Sa Trung Thổ', 'Sa Trung Thổ',
  'Thiên Thượng Hỏa', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Thạch Lựu Mộc', 'Đại Hải Thủy', 'Đại Hải Thủy'
];

function napAmToNguHanh(napAm) {
  if (napAm.includes('Kim')) return 'Kim';
  if (napAm.includes('Mộc')) return 'Mộc';
  if (napAm.includes('Thủy')) return 'Thủy';
  if (napAm.includes('Hỏa')) return 'Hỏa';
  return 'Thổ';
}

const CUNG_MENH = [
  'Mệnh', 'Phụ Mẫu', 'Phúc Đức', 'Điền Trạch', 'Quan Lộc', 'Nô Bộc',
  'Thiên Di', 'Tật Ách', 'Tài Bạch', 'Tử Tức', 'Phu Thê', 'Huynh Đệ'
];

const CHINH_TINH = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh',
  'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương',
  'Thất Sát', 'Phá Quân'
];

// Lưu lại lá số vừa lập gần nhất, dùng để AI dựng báo cáo chi tiết khi mở khóa gói trả phí
let lastTuviResult = null;

// Hash chuỗi -> số nguyên dương, để kết quả luôn giống nhau với cùng 1 lá số
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function buildOverviewText(name, gender, menh, chiMenh, sao) {
  return `${name} mang bản mệnh ${menh}, cung Mệnh an tại ${chiMenh}, được ${sao} thủ chiếu. Đây là người có nội lực bền bỉ, tư duy độc lập và khả năng thích nghi tốt trước biến động. Ngũ hành ${menh} cho thấy xu hướng tính cách thiên về sự ${menh === 'Kim' ? 'quyết đoán, rõ ràng' : menh === 'Mộc' ? 'ôn hòa, cầu tiến' : menh === 'Thủy' ? 'linh hoạt, khôn khéo' : menh === 'Hỏa' ? 'nhiệt huyết, quyết liệt' : 'chắc chắn, kiên định'}, phù hợp phát triển bền vững theo thời gian hơn là thành công chớp nhoáng.`;
}

function buildCareerText(menh, sao, gender) {
  const hop = { Kim: 'tài chính, cơ khí, kim loại, công nghệ', Mộc: 'giáo dục, xuất bản, nông lâm, thiết kế', Thủy: 'truyền thông, vận tải, du lịch, ngoại giao', Hỏa: 'năng lượng, marketing, ẩm thực, giải trí', Thổ: 'bất động sản, xây dựng, nông nghiệp, hành chính' }[menh];
  return `Sao ${sao} chủ về khả năng lãnh đạo và tư duy chiến lược, thuận lợi khi làm việc trong các lĩnh vực ${hop}. Giai đoạn trung vận là thời điểm tài lộc hanh thông nhất nếu biết nắm bắt cơ hội và tránh nóng vội trong quyết định lớn. Nên hợp tác với người có bản mệnh tương sinh để công việc thuận buồm xuôi gió.`;
}

function buildLoveText(chiMenh, gender, seed) {
  const xuHuong = seed % 3;
  const variants = [
    `Đường tình duyên có phần muộn nhưng khi đã gắn kết thì bền chặt, lâu dài. Nên chủ động mở lòng và tránh quá cầu toàn khi chọn bạn đời.`,
    `Tình cảm giai đoạn đầu đời khá thăng trầm, tuy nhiên càng về sau càng ổn định nhờ sự chín chắn trong cách nhìn nhận đối phương.`,
    `Cung Mệnh tại ${chiMenh} cho thấy đời sống tình cảm hài hòa, được người thân hai bên ủng hộ, hôn nhân có xu hướng viên mãn nếu giữ được sự chân thành.`
  ];
  return variants[xuHuong];
}

function buildHealthText(menh, seed) {
  const luuY = { Kim: 'hô hấp và phổi', Mộc: 'gan và hệ thần kinh', Thủy: 'thận và tuần hoàn', Hỏa: 'tim mạch và huyết áp', Thổ: 'tiêu hóa và dạ dày' }[menh];
  return `Sức khỏe nhìn chung ổn định nhưng cần lưu ý về ${luuY}, đặc biệt trong giai đoạn giao mùa. Nên duy trì vận động đều đặn, hạn chế thức khuya và cân bằng giữa công việc với nghỉ ngơi để giữ vượng khí lâu dài.`;
}

function starsFromSeed(seed, offset) {
  const n = 3 + ((seed + offset) % 3); // 3-5 sao
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function initTuviForm() {
  const form = document.getElementById('tuviForm');
  const submitBtn = document.getElementById('submitBtn');
  const loadingDots = document.getElementById('loadingDots');
  const resultArea = document.getElementById('resultArea');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('fullname').value.trim() || 'Bạn';
    const birthdate = document.getElementById('birthdate').value;
    const birthtime = document.getElementById('birthtime').value;
    const birthplace = document.getElementById('birthplace').value.trim();
    const gender = document.querySelector('.gender-btn.active').dataset.gender;

    if (!birthdate || !birthtime || !birthplace) return;

    submitBtn.disabled = true;
    resultArea.classList.remove('visible');
    loadingDots.style.display = 'flex';

    setTimeout(() => {
      const result = computeTuvi(name, birthdate, birthtime, birthplace, gender);
      renderResult(result);
      loadingDots.style.display = 'none';
      submitBtn.disabled = false;
      resultArea.classList.add('visible');
      resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1200);
  });
}

/* =============================================
   AN SAO TỬ VI CHUẨN — đổi lịch âm + lập lá số 12 cung
   Thuật toán đổi lịch: Hồ Ngọc Đức (chuẩn lịch Việt Nam).
   Các công thức an Mệnh/Thân/Cục/14 chính tinh đã được
   đối chiếu khớp 100% với ví dụ lá số thực tế (Altuvi).
   ============================================= */

function jdFromDate(dd, mm, yy) {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return jd;
}

function newMoon(k) {
  const T = k / 1236.85;
  const T2 = T * T, T3 = T2 * T, dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

function sunLongitudeRad(jdn) {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - Math.PI * 2 * Math.floor(L / (Math.PI * 2));
  return L;
}
function sunLongitude(dayNumber, tz) {
  return Math.floor(sunLongitudeRad(dayNumber - 0.5 - tz / 24) / Math.PI * 6);
}
function newMoonDay(k, tz) {
  return Math.floor(newMoon(k) + 0.5 + tz / 24);
}
function lunarMonth11(yy, tz) {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = newMoonDay(k, tz);
  if (sunLongitude(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);
  return nm;
}
function leapMonthOffset(a11, tz) {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0, i = 1;
  let arc = sunLongitude(newMoonDay(k + i, tz), tz);
  do {
    last = arc;
    i++;
    arc = sunLongitude(newMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}
function solarToLunar(dd, mm, yy, tz) {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = newMoonDay(k + 1, tz);
  if (monthStart > dayNumber) monthStart = newMoonDay(k, tz);
  let a11 = lunarMonth11(yy, tz);
  let b11 = a11;
  let lunarYear;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = lunarMonth11(yy - 1, tz);
  } else {
    lunarYear = yy + 1;
    b11 = lunarMonth11(yy + 1, tz);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarLeap = 0;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = leapMonthOffset(a11, tz);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) lunarLeap = 1;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, leap: lunarLeap, jd: dayNumber };
}

// ===== Can Chi năm / tháng / ngày =====
function canChiNam(year) {
  const canIdx = ((year - 4) % 10 + 10) % 10;
  const chiIdx = ((year - 4) % 12 + 12) % 12;
  return { canIdx, chiIdx };
}
function canChiNgay(jd) {
  const canIdx = ((jd + 9) % 10 + 10) % 10;
  const chiIdx = ((jd + 1) % 12 + 12) % 12;
  return { canIdx, chiIdx };
}
function canThangGiengIdx(canNamIdx) {
  return (2 * (canNamIdx % 5) + 2) % 10;
}
function canChiThang(canNamIdx, thangAm) {
  const canIdx = (canThangGiengIdx(canNamIdx) + (thangAm - 1)) % 10;
  const chiIdx = (2 + (thangAm - 1)) % 12; // Dần = tháng 1
  return { canIdx, chiIdx };
}
// Trụ Giờ (Bát Tự) theo quy tắc "Ngũ Thử Độn": Giáp/Kỷ -> Giáp Tý, Ất/Canh -> Bính Tý,
// Bính/Tân -> Mậu Tý, Đinh/Nhâm -> Canh Tý, Mậu/Quý -> Nhâm Tý.
function canChiGio(dayCanIdx, gioChiIdx) {
  const canIdx = ((dayCanIdx % 5) * 2 + gioChiIdx) % 10;
  return { canIdx, chiIdx: gioChiIdx };
}
function napAmOf(canIdx, chiIdx) {
  for (let i = 0; i < 60; i++) {
    if (i % 10 === canIdx && i % 12 === chiIdx) return NAP_AM[i];
  }
  return null;
}

// ===== An Mệnh, Thân, Cục =====
function anMenhThan(thangAm, gioChiIdx) {
  const monthPos = (1 + thangAm) % 12; // Dần(2) + (tháng-1), đếm thuận
  const menhIdx = ((monthPos - gioChiIdx) % 12 + 12) % 12;
  const thanIdx = (monthPos + gioChiIdx) % 12;
  return { menhIdx, thanIdx };
}
function canCuaCung(canNamIdx, cungChiIdx) {
  const offsetFromDan = ((cungChiIdx - 2) % 12 + 12) % 12;
  return (canThangGiengIdx(canNamIdx) + offsetFromDan) % 10;
}
function xacDinhCuc(canNamIdx, menhIdx) {
  const canMenhCung = canCuaCung(canNamIdx, menhIdx);
  const napAmCuc = napAmOf(canMenhCung, menhIdx);
  const nguHanhCuc = napAmToNguHanh(napAmCuc);
  const socuc = { Thủy: 2, Mộc: 3, Kim: 4, Thổ: 5, Hỏa: 6 }[nguHanhCuc];
  const tenCuc = { Thủy: 'Thủy Nhị Cục', Mộc: 'Mộc Tam Cục', Kim: 'Kim Tứ Cục', Thổ: 'Thổ Ngũ Cục', Hỏa: 'Hỏa Lục Cục' }[nguHanhCuc];
  return { socuc, tenCuc, nguHanhCuc, napAmCuc };
}

// ===== An Tử Vi + 13 chính tinh còn lại =====
function anTuVi(ngayAm, cucSo) {
  let a = 0;
  while ((ngayAm + a) % cucSo !== 0) a++;
  const b = (ngayAm + a) / cucSo;
  let pos = (2 + (b - 1)) % 12;
  if (a % 2 === 1) pos = ((pos - a) % 12 + 12) % 12;
  else if (a > 0) pos = (pos + a) % 12;
  return pos;
}
function anChinhTinh(ngayAm, cucSo) {
  const tuVi = anTuVi(ngayAm, cucSo);
  const lui = (n) => ((tuVi - n) % 12 + 12) % 12;
  const thienPhu = ((16 - tuVi) % 12 + 12) % 12;
  const tien = (n) => (thienPhu + n) % 12;

  const map = {}; // chiIdx -> [tên sao]
  const add = (idx, ten) => { (map[idx] = map[idx] || []).push(ten); };

  add(tuVi, 'Tử Vi');
  add(lui(1), 'Thiên Cơ');
  add(lui(3), 'Thái Dương');
  add(lui(4), 'Vũ Khúc');
  add(lui(5), 'Thiên Đồng');
  add(lui(8), 'Liêm Trinh');

  add(thienPhu, 'Thiên Phủ');
  add(tien(1), 'Thái Âm');
  add(tien(2), 'Tham Lang');
  add(tien(3), 'Cự Môn');
  add(tien(4), 'Thiên Tướng');
  add(tien(5), 'Thiên Lương');
  add(tien(6), 'Thất Sát');
  add(tien(10), 'Phá Quân');

  return { map, tuVi, thienPhu };
}

// ===== Phụ tinh (các sao phụ quan trọng, an theo tháng/giờ/năm) =====
const LOC_TON_THEO_CAN = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0]; // Giáp..Quý -> chi index
const KHOI_VIET_THEO_CAN = [
  [1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]
]; // [Khôi, Việt] theo Can năm (Giáp..Quý)

function anPhuTinh(map, { thangAm, gioChiIdx, canNamIdx, chiNamIdx }) {
  const add = (idx, ten) => { (map[idx] = map[idx] || []).push(ten); };

  // Tả Phù (Thìn + tháng thuận), Hữu Bật (Tuất - tháng nghịch)
  add((4 + (thangAm - 1)) % 12, 'Tả Phù');
  add(((10 - (thangAm - 1)) % 12 + 12) % 12, 'Hữu Bật');

  // Văn Xương (Tuất - giờ nghịch), Văn Khúc (Thìn + giờ thuận)
  add(((10 - gioChiIdx) % 12 + 12) % 12, 'Văn Xương');
  add((4 + gioChiIdx) % 12, 'Văn Khúc');

  // Lộc Tồn theo Can năm, Kình Dương / Đà La kề hai bên
  const locTon = LOC_TON_THEO_CAN[canNamIdx];
  add(locTon, 'Lộc Tồn');
  add((locTon + 1) % 12, 'Kình Dương');
  add(((locTon - 1) % 12 + 12) % 12, 'Đà La');

  // Thiên Khôi, Thiên Việt theo Can năm
  const [khoi, viet] = KHOI_VIET_THEO_CAN[canNamIdx];
  add(khoi, 'Thiên Khôi');
  add(viet, 'Thiên Việt');

  // Địa Kiếp (Hợi + giờ thuận), Địa Không (Hợi - giờ nghịch)
  add((11 + gioChiIdx) % 12, 'Địa Kiếp');
  add(((11 - gioChiIdx) % 12 + 12) % 12, 'Địa Không');

  // Thiên Mã, Đào Hoa theo tam hợp Chi năm
  const tamHop = chiNamIdx % 4; // 0:Thân-Tý-Thìn 1:Tỵ-Dậu-Sửu 2:Dần-Ngọ-Tuất 3:Hợi-Mão-Mùi
  const thienMaTheoTamHop = [2, 11, 8, 5]; // Dần, Hợi, Thân, Tỵ
  const daoHoaTheoTamHop = [9, 6, 3, 0]; // Dậu, Ngọ, Mão, Tý
  add(thienMaTheoTamHop[tamHop], 'Thiên Mã');
  add(daoHoaTheoTamHop[tamHop], 'Đào Hoa');

  // Hồng Loan (khởi Mão, đếm nghịch theo Chi năm)
  add(((3 - chiNamIdx) % 12 + 12) % 12, 'Hồng Loan');
}

// ===== Vòng Trường Sinh (12 giai đoạn) =====
const TRANG_SINH_STAGES = ['Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', 'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'];
function isAmDuongThuanLy(canNamIdx, gender) {
  const namDuong = canNamIdx % 2 === 0; // Giáp,Bính,Mậu,Canh,Nhâm = dương
  const laNam = gender === 'Nam';
  return (namDuong && laNam) || (!namDuong && !laNam);
}
function anVongTrangSinh(nguHanhCuc, thuanLy) {
  const start = { Kim: 5, Mộc: 11, Thủy: 8, Thổ: 8, Hỏa: 2 }[nguHanhCuc]; // Tỵ, Hợi, Thân, Thân, Dần
  const stageOf = {};
  for (let i = 0; i < 12; i++) {
    const idx = thuanLy ? (start + i) % 12 : ((start - i) % 12 + 12) % 12;
    stageOf[idx] = TRANG_SINH_STAGES[i];
  }
  return stageOf;
}

// ===== Đại Vận: tuổi khởi vận từng cung, thuận/nghịch theo Âm Dương =====
function anDaiVanTheoCung(cucSo, menhIdx, thuanLy) {
  const tuoiBatDauOf = {};
  for (let i = 0; i < 12; i++) {
    const idx = thuanLy ? (menhIdx + i) % 12 : ((menhIdx - i) % 12 + 12) % 12;
    tuoiBatDauOf[idx] = cucSo + i * 10;
  }
  return tuoiBatDauOf;
}

function layTenCung(chiIdx, menhIdx) {
  const offset = ((chiIdx - menhIdx) % 12 + 12) % 12;
  return CUNG_MENH[offset];
}

function computeTuvi(name, birthdate, birthtime, birthplace, gender) {
  const dateObj = new Date(birthdate + 'T00:00:00');
  const dd = dateObj.getDate(), mm = dateObj.getMonth() + 1, yy = dateObj.getFullYear();

  const lunar = solarToLunar(dd, mm, yy, 7);
  const { canIdx: canNamIdx, chiIdx: chiNamIdx } = canChiNam(lunar.year);
  const canChiNamStr = `${CAN[canNamIdx]} ${CHI[chiNamIdx]}`;
  const napAm = napAmOf(canNamIdx, chiNamIdx);
  const menh = napAmToNguHanh(napAm);

  const { canIdx: canThangIdx, chiIdx: chiThangIdx } = canChiThang(canNamIdx, lunar.month);
  const canChiThangStr = `${CAN[canThangIdx]} ${CHI[chiThangIdx]}`;
  const ngayCC = canChiNgay(lunar.jd);
  const canChiNgayStr = `${CAN[ngayCC.canIdx]} ${CHI[ngayCC.chiIdx]}`;

  const gioChiIdx = CHI.indexOf(birthtime);
  const { menhIdx, thanIdx } = anMenhThan(lunar.month, gioChiIdx);
  const cuc = xacDinhCuc(canNamIdx, menhIdx);

  const { map: chinhTinhMap } = anChinhTinh(lunar.day, cuc.socuc);
  anPhuTinh(chinhTinhMap, { thangAm: lunar.month, gioChiIdx, canNamIdx, chiNamIdx });

  const thuanLy = isAmDuongThuanLy(canNamIdx, gender);
  const trangSinhMap = anVongTrangSinh(cuc.nguHanhCuc, thuanLy);
  const daiVanMap = anDaiVanTheoCung(cuc.socuc, menhIdx, thuanLy);

  const saoChuMenh = (chinhTinhMap[menhIdx] || []).filter(t => CHINH_TINH.includes(t));
  const sao = saoChuMenh.length ? saoChuMenh.join(' - ') : 'Vô Chính Diệu';
  const chiMenh = CHI[menhIdx];

  const seed = hashString(`${name}|${birthdate}|${birthtime}|${birthplace}|${gender}`);

  // Dựng dữ liệu đầy đủ 12 cung cho lá số đồ họa
  const cungList = [];
  for (let chiIdx = 0; chiIdx < 12; chiIdx++) {
    const canCung = canCuaCung(canNamIdx, chiIdx);
    cungList.push({
      chiIdx,
      chiTen: CHI[chiIdx],
      canTen: CAN[canCung],
      tenCung: layTenCung(chiIdx, menhIdx),
      laMenh: chiIdx === menhIdx,
      laThan: chiIdx === thanIdx,
      sao: (chinhTinhMap[chiIdx] || []).filter(t => CHINH_TINH.includes(t)),
      saoPhu: (chinhTinhMap[chiIdx] || []).filter(t => !CHINH_TINH.includes(t)),
      trangSinh: trangSinhMap[chiIdx],
      tuoiDaiVan: daiVanMap[chiIdx]
    });
  }

  return {
    name, gender, birthdate, birthtime, birthplace, seed,
    dateFormatted: `${String(dd).padStart(2, '0')}/${String(mm).padStart(2, '0')}/${yy}`,
    lunar, canChi: canChiNamStr, canChiThang: canChiThangStr, canChiNgay: canChiNgayStr,
    napAm, menh, chiMenh, sao, menhIdx, thanIdx, cuc, thuanLy, cungList,
    // Dữ liệu thô dùng lại cho Bát Tự (battu-engine.js) — tránh tính lại lịch âm/Can Chi
    // từ đầu để không bao giờ lệch với Can Chi Năm đã hiển thị ở trên.
    canNamIdx, ngayCC, gioChiIdx
  };
}

function renderResult(r) {
  lastTuviResult = r;

  document.getElementById('resName').textContent = `Lá số của ${r.name}`;
  document.getElementById('resMeta').textContent =
    `Sinh ngày ${r.dateFormatted} · Giờ ${r.birthtime} · ${r.birthplace} · Năm ${r.canChi} · ${r.gender}`;

  document.getElementById('resMenh').textContent = `${r.menh} (${r.napAm})`;
  document.getElementById('resCung').textContent = r.chiMenh;
  document.getElementById('resSao').textContent = r.sao;

  document.getElementById('resOverview').textContent = buildOverviewText(r.name, r.gender, r.menh, r.chiMenh, r.sao);
  document.getElementById('resCareer').textContent = buildCareerText(r.menh, r.sao, r.gender);
  document.getElementById('resLove').textContent = buildLoveText(r.chiMenh, r.gender, r.seed);
  document.getElementById('resHealth').textContent = buildHealthText(r.menh, r.seed);

  renderLaSoChart(r);

  const westernEl = document.getElementById('westernBlock');
  if (westernEl && typeof buildWesternHtml === 'function') {
    const cityName = document.getElementById('natalCity')?.value || 'Hà Nội';
    westernEl.innerHTML = buildWesternHtml(r.birthdate, r.birthtime, cityName);
  }

  document.getElementById('starOverview').textContent = starsFromSeed(r.seed, 1);
  document.getElementById('starCareer').textContent = starsFromSeed(r.seed, 2);
  document.getElementById('starLove').textContent = starsFromSeed(r.seed, 3);
  document.getElementById('starHealth').textContent = starsFromSeed(r.seed, 4);
}

// Vị trí 12 cung trên lưới 4x4 cố định (chuẩn lá số tử vi truyền thống)
const LASO_GRID_POS = {
  'Tỵ': [1, 1], 'Ngọ': [1, 2], 'Mùi': [1, 3], 'Thân': [1, 4],
  'Thìn': [2, 1], 'Dậu': [2, 4],
  'Mão': [3, 1], 'Tuất': [3, 4],
  'Dần': [4, 1], 'Sửu': [4, 2], 'Tý': [4, 3], 'Hợi': [4, 4]
};

// Tách riêng phần dựng HTML (thuần, không đụng DOM) để dùng chung được cho
// cả lá số trên trang web (renderLaSoChart) lẫn lá số ở đầu file PDF (tuvi-pdf.js).
function buildLaSoChartHtml(r) {
  const cellsHtml = r.cungList.map(c => {
    const [row, col] = LASO_GRID_POS[c.chiTen];
    const chinhTinhHtml = c.sao.length
      ? `<div class="laso-sao-chinh">${c.sao.map(s => {
          const d = starDignity(s, c.chiTen);
          return d ? `${s} <span class="laso-dignity laso-dignity-${d.code}" title="${DIGNITY_INFO[d.code].label} — ${DIGNITY_INFO[d.code].desc}">${d.code}</span>` : s;
        }).join(' · ')}</div>`
      : `<div class="laso-sao-chinh laso-vcd">Vô Chính Diệu</div>`;
    const phuTinhHtml = c.saoPhu.length
      ? `<div class="laso-sao-phu">${c.saoPhu.join(' · ')}</div>` : '';
    const badges = [
      c.laMenh ? '<span class="laso-badge laso-badge-menh">Mệnh</span>' : '',
      c.laThan ? '<span class="laso-badge laso-badge-than">Thân</span>' : ''
    ].join('');
    return `
      <div class="laso-cell${c.laMenh ? ' is-menh' : ''}${c.laThan ? ' is-than' : ''}" style="grid-row:${row};grid-column:${col}">
        <div class="laso-cell-head">
          <span class="laso-canchi">${c.canTen} ${c.chiTen}</span>
          <span class="laso-tuoi">${c.tuoiDaiVan}</span>
        </div>
        <div class="laso-cungname">${c.tenCung} ${badges}</div>
        ${chinhTinhHtml}
        ${phuTinhHtml}
        <div class="laso-trangsinh">${c.trangSinh || ''}</div>
      </div>`;
  }).join('');

  const leapTxt = r.lunar.leap ? ' (nhuận)' : '';
  const centerHtml = `
    <div class="laso-center">
      <div class="laso-center-title">Lá Số Tử Vi</div>
      <div class="laso-center-name">${r.name}</div>
      <table class="laso-center-table">
        <tr><td>Dương lịch</td><td>${r.dateFormatted}</td></tr>
        <tr><td>Âm lịch</td><td>Ngày ${r.lunar.day} Tháng ${r.lunar.month}${leapTxt} Năm ${r.canChi}</td></tr>
        <tr><td>Giờ sinh</td><td>${r.birthtime} (${r.canChiThang} / ${r.canChiNgay})</td></tr>
        <tr><td>Giới tính</td><td>${r.gender} (${r.thuanLy ? 'Thuận lý' : 'Nghịch lý'})</td></tr>
        <tr><td>Bản Mệnh</td><td>${r.napAm} (${r.menh})</td></tr>
        <tr><td>Cục</td><td>${r.cuc.tenCuc}${r.cuc.nguHanhCuc === r.menh ? ' — hòa Bản Mệnh' : ''}</td></tr>
      </table>
    </div>`;

  return cellsHtml + centerHtml;
}

function buildLasoLegendHtml() {
  const items = ['M', 'V', 'D', 'B', 'H'].map(code => `
    <span class="laso-legend-item"><span class="laso-dignity laso-dignity-${code}">${code}</span> ${DIGNITY_INFO[code].label}</span>
  `).join('');
  return `
    <div class="laso-legend">
      ${items}
      <span class="laso-legend-note">Xếp hạng theo quan hệ Ngũ Hành giữa sao và cung tọa thủ — mang tính tham khảo, không phải bảng Miếu/Vượng cổ truyền cố định.</span>
    </div>`;
}

// Biểu đồ Ngũ Hành: đếm số chính tinh thuộc mỗi hành (Kim/Mộc/Thủy/Hỏa/Thổ)
// đang hiện diện trong lá số của gia chủ — cho biết hành nào đang chiếm ưu thế.
// Vẽ bằng SVG thuần (không cần thư viện ngoài), dùng chung được cho cả web và PDF.
const NGU_HANH_ORDER = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];
const NGU_HANH_COLOR = { Kim: '#d1d5db', Mộc: '#4ade80', Thủy: '#60a5fa', Hỏa: '#f87171', Thổ: '#d4a373' };

function countNguHanhInChart(r) {
  const counts = { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 };
  r.cungList.forEach(c => {
    (c.sao || []).forEach(s => {
      const h = STAR_NGU_HANH[s];
      if (h) counts[h]++;
    });
  });
  return counts;
}

// Hàm thuần dùng chung: vẽ radar Ngũ Hành từ bất kỳ bộ đếm {Kim,Mộc,Thủy,Hỏa,Thổ}
// nào — tái dùng cho cả lá số Tử Vi (đếm chính tinh) lẫn Bát Tự (đếm 8 ký tự Can Chi).
function buildNguHanhChartHtmlFromCounts(counts, title, desc) {
  const maxVal = Math.max(...NGU_HANH_ORDER.map(h => counts[h]), 3);
  const cx = 110, cy = 105, R = 78;
  const angleFor = i => (Math.PI * 2 * i) / 5 - Math.PI / 2;
  const pointAt = (i, val) => {
    const a = angleFor(i);
    const rad = (val / maxVal) * R;
    return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
  };

  const ringLevels = [0.25, 0.5, 0.75, 1];
  const ringsHtml = ringLevels.map(lvl => {
    const pts = NGU_HANH_ORDER.map((_, i) => pointAt(i, maxVal * lvl).join(',')).join(' ');
    return `<polygon points="${pts}" class="nguhanh-axis" fill="none"/>`;
  }).join('');

  const axesHtml = NGU_HANH_ORDER.map((_, i) => {
    const [x, y] = pointAt(i, maxVal);
    return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="nguhanh-axis"/>`;
  }).join('');

  const dataPts = NGU_HANH_ORDER.map((h, i) => pointAt(i, counts[h]).join(',')).join(' ');

  const labelsHtml = NGU_HANH_ORDER.map((h, i) => {
    const [x, y] = pointAt(i, maxVal * 1.22);
    return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-weight="700" fill="${NGU_HANH_COLOR[h]}">${h} (${counts[h]})</text>`;
  }).join('');

  return `
    <div class="nguhanh-chart-wrap">
      <div class="nguhanh-chart-title">🌗 ${title}</div>
      <div class="nguhanh-chart-desc">${desc}</div>
      <svg viewBox="0 0 220 210" width="260" height="248" xmlns="http://www.w3.org/2000/svg">
        ${ringsHtml}
        ${axesHtml}
        <polygon points="${dataPts}" class="nguhanh-poly" stroke-width="2"/>
        ${labelsHtml}
      </svg>
    </div>`;
}

function buildNguHanhChartHtml(r) {
  const counts = countNguHanhInChart(r);
  return buildNguHanhChartHtmlFromCounts(counts, 'Biểu Đồ Ngũ Hành', 'Số chính tinh thuộc mỗi hành đang hiện diện trong lá số — hành nào chiếm ưu thế sẽ ảnh hưởng đến khí chất tổng thể.');
}

// Dựng khối HTML Sun/Moon/Rising cho kết quả Tử Vi miễn phí — dùng các hàm
// thuần từ western-astrology.js (sunSign/moonSign/risingSigns/ZODIAC_MEANINGS).
function buildWesternHtml(birthdate, birthtime, cityName) {
  const sun = sunSign(birthdate);
  const moon = moonSign(birthdate, birthtime);
  const { signs: risingArr, uncertain } = risingSigns(birthdate, birthtime, cityName);
  const risingText = risingArr.length === 2 ? `${risingArr[0]} hoặc ${risingArr[1]}` : (risingArr[0] || '—');
  const sunM = ZODIAC_MEANINGS[sun] || {};
  const moonM = ZODIAC_MEANINGS[moon] || {};
  const risingNote = uncertain
    ? `<p class="battu-disclaimer">Giờ sinh trên form chỉ biết theo khung 2 tiếng, trong khi Cung Mọc đổi cung mỗi ~2 tiếng — nên Cung Mọc thực tế nằm ở 1 trong 2 cung trên. Muốn chính xác tuyệt đối cần giờ sinh chính xác đến phút.</p>`
    : '';
  return `
    <div class="result-block">
      <div class="result-block-title">✨ Chiêm Tinh Tây Phương</div>
      <div class="result-main">
        <div class="result-tag"><div class="result-tag-label">Cung Mặt Trời</div><div class="result-tag-val">${sun}</div></div>
        <div class="result-tag"><div class="result-tag-label">Cung Mặt Trăng</div><div class="result-tag-val">${moon}</div></div>
        <div class="result-tag"><div class="result-tag-label">Cung Mọc</div><div class="result-tag-val">${risingText}</div></div>
      </div>
      ${risingNote}
      <p><strong>${sunM.label || sun}:</strong> ${sunM.overview || ''}</p>
      <p><strong>Mặt Trăng ${moon}:</strong> ${moonM.overview || ''}</p>
    </div>`;
}

function renderLaSoChart(r) {
  const grid = document.getElementById('laSoGrid');
  if (!grid) return;
  grid.innerHTML = buildLaSoChartHtml(r);
  const legendEl = document.getElementById('laSoLegend');
  if (legendEl) legendEl.innerHTML = buildLasoLegendHtml();
  const nguHanhEl = document.getElementById('nguHanhChart');
  if (nguHanhEl) nguHanhEl.innerHTML = buildNguHanhChartHtml(r);
  const batTuEl = document.getElementById('batTuBlock');
  if (batTuEl && typeof buildBatTuHtml === 'function') batTuEl.innerHTML = buildBatTuHtml(r);
}

/* =============================================
   THẦN SỐ HỌC (Numerology - hệ Pythagoras)
   ============================================= */

// Toàn bộ logic tính toán thần số học (thuần, không phụ thuộc DOM) đã được
// tách sang file numerology-engine.js — nạp trước script.js trong index.html.
// Các biến/hàm dùng ở đây: computeNumerology, NUMEROLOGY_MEANINGS,
// CHALLENGE_MEANINGS, KARMIC_DEBT_MEANINGS, PERSONAL_YEAR_MEANINGS,
// PINNACLE_MEANINGS, reduceNumber, reduceToSingle, digitsSum... đều là
// biến global do numerology-engine.js expose.

// Lưu lại kết quả thần số học vừa tính gần nhất, dùng khi mở khóa gói PDF trả phí
let lastNumerologyResult = null;

function renderNumerologyResult(r) {
  lastNumerologyResult = r;

  const date = new Date(r.birthdate + 'T00:00:00');
  const dateFormatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;

  document.getElementById('numerResName').textContent = `Thần số học của ${r.name}`;
  document.getElementById('numerResMeta').textContent = `Sinh ngày ${dateFormatted}`;

  document.getElementById('numerLifePath').textContent = r.lifePath;
  document.getElementById('numerExpression').textContent = r.expression;
  document.getElementById('numerSoulUrge').textContent = r.soulUrge;
  document.getElementById('numerPersonality').textContent = r.personality;
  document.getElementById('numerAttitude').textContent = r.attitude;
  document.getElementById('numerMaturity').textContent = r.maturity;
  document.getElementById('numerBirthday').textContent = r.birthdayNumber;

  const sunBadgeEl = document.getElementById('numerSunBadge');
  if (sunBadgeEl && typeof sunSign === 'function') {
    const sun = sunSign(r.birthdate);
    const sunM = (typeof ZODIAC_MEANINGS !== 'undefined' && ZODIAC_MEANINGS[sun]) || {};
    sunBadgeEl.innerHTML = `<div class="result-block"><div class="result-block-title">✨ Cung Mặt Trời: ${sun}</div><p>${sunM.overview || ''}</p></div>`;
  }

  const meaning = NUMEROLOGY_MEANINGS[r.lifePath] || NUMEROLOGY_MEANINGS[1];
  const attitudeMeaning = NUMEROLOGY_MEANINGS[r.attitude] || NUMEROLOGY_MEANINGS[1];
  const maturityMeaning = NUMEROLOGY_MEANINGS[r.maturity] || NUMEROLOGY_MEANINGS[1];
  const birthdayMeaning = NUMEROLOGY_MEANINGS[r.birthdayNumber] || NUMEROLOGY_MEANINGS[1];

  document.getElementById('numerOverview').textContent =
    `Số Chủ Đạo của ${r.name} là ${r.lifePath} — ${meaning.label}. ${meaning.overview} Số Sứ Mệnh ${r.expression} phản ánh mục tiêu bạn hướng tới trong cuộc đời, trong khi Số Linh Hồn ${r.soulUrge} tiết lộ khát khao nội tâm sâu thẳm nhất của bạn.`;
  document.getElementById('numerCareer').textContent = meaning.career;
  document.getElementById('numerLove').textContent = meaning.love;
  document.getElementById('numerChallenge').textContent = meaning.challenge;
  document.getElementById('numerAttitudeText').textContent =
    `Số Thái Độ ${r.attitude} — ${attitudeMeaning.label}. Đây là ấn tượng đầu tiên bạn để lại với người khác: ${attitudeMeaning.overview}`;
  document.getElementById('numerMaturityText').textContent =
    `Số Trưởng Thành ${r.maturity} — ${maturityMeaning.label}. Từ khoảng sau 35-40 tuổi, cuộc đời bạn dần chuyển hướng theo tinh thần của con số này: ${maturityMeaning.overview}`;
  document.getElementById('numerBirthdayText').textContent =
    `Số Ngày Sinh ${r.birthdayNumber} — ${birthdayMeaning.label}. Đây là tài năng bẩm sinh, món quà tự nhiên bạn mang theo từ khi sinh ra: ${birthdayMeaning.overview}`;

  // 4 Số Thử Thách
  const challengeLabels = ['Thử Thách 1 (Thời trẻ)', 'Thử Thách 2 (Trưởng thành)', 'Thử Thách 3 (Trung niên)', 'Thử Thách 4 (Hậu vận)'];
  document.getElementById('numerChallengeList').innerHTML = r.challenges.map((c, i) => `
    <div class="result-block">
      <div class="result-block-title">${challengeLabels[i]} <span class="result-stars">Số ${c}</span></div>
      <p>${CHALLENGE_MEANINGS[c] || CHALLENGE_MEANINGS[0]}</p>
    </div>
  `).join('');

  // Nợ Nghiệp (chỉ hiện nếu có)
  const karmicBlock = document.getElementById('numerKarmicBlock');
  if (r.karmicDebts.length) {
    document.getElementById('numerKarmicList').innerHTML = r.karmicDebts.map(k => `
      <p style="margin-bottom:10px"><strong style="color:var(--gold)">${k.label} — Nợ Nghiệp ${k.num}:</strong> ${KARMIC_DEBT_MEANINGS[k.num]}</p>
    `).join('');
    karmicBlock.style.display = 'block';
  } else {
    karmicBlock.style.display = 'none';
  }

  // Phân tích 60 Năm Cuộc Đời — 6 thập kỷ
  const thisYear = new Date().getFullYear();
  document.getElementById('numerSixtyYear').innerHTML = r.sixtyYearLife.map(dec => {
    const dominantMeaning = PERSONAL_YEAR_MEANINGS[dec.dominant];
    const yearsHtml = dec.years.map(y => `
      <div class="year-chip${y.year === thisYear ? ' is-current' : ''}" title="${PERSONAL_YEAR_MEANINGS[y.py].title}">
        <div class="year-chip-year">${y.year}</div>
        <div class="year-chip-age">${y.age} tuổi</div>
        <div class="year-chip-py">${y.py}</div>
      </div>
    `).join('');
    return `
      <div class="decade-block">
        <div class="decade-header">
          <span class="decade-num">Thập Kỷ ${dec.decadeIndex}</span>
          <span class="decade-age">${dec.ageStart} – ${dec.ageEnd} tuổi (${dec.yearStart} – ${dec.yearEnd})</span>
        </div>
        <p class="decade-theme">${dec.theme} Năng lượng chủ đạo giai đoạn này là số <strong style="color:var(--gold)">${dec.dominant}</strong> — <strong>${dominantMeaning.title}</strong>: ${dominantMeaning.desc}</p>
        <div class="decade-years">${yearsHtml}</div>
      </div>
    `;
  }).join('');

  // 4 Đỉnh Cao Cuộc Đời
  document.getElementById('numerPinnacles').innerHTML = r.pinnacles.map(p => {
    const meaning = PINNACLE_MEANINGS[p.num] || PINNACLE_MEANINGS[1];
    const ageRangeText = p.ageEnd !== null
      ? `${p.ageStart} – ${p.ageEnd} tuổi (${p.yearStart} – ${p.yearEnd})`
      : `Từ ${p.ageStart} tuổi trở đi (từ năm ${p.yearStart})`;
    return `
      <div class="result-block pinnacle-block">
        <div class="result-block-title">🏔️ Đỉnh Cao ${p.index}: Số ${p.num} — ${meaning.title}</div>
        <p class="pinnacle-age">${ageRangeText}</p>
        <p><strong style="color:var(--gold)">Nên làm gì:</strong> ${meaning.doWhat}</p>
        <p><strong style="color:var(--gold)">Nên học gì:</strong> ${meaning.learnWhat}</p>
        <p><strong style="color:var(--gold)">Nên sống thế nào:</strong> ${meaning.howToLive}</p>
      </div>
    `;
  }).join('');

  renderNumerologyPremiumTeaser(r);
}

// Bản xem trước (khóa) của nội dung 5 phần trong báo cáo trả phí, hiển thị
// ngay trên trang cho khách miễn phí thấy rõ họ đang thiếu gì so với bản trả phí.
function renderNumerologyPremiumTeaser(r) {
  const teaserEl = document.getElementById('numerPremiumTeaser');
  const badgeEl = document.getElementById('numerTeaserLifePath');
  if (!teaserEl) return;
  if (badgeEl) badgeEl.textContent = r.lifePath;

  const detailed = NUMEROLOGY_CONTENT_DETAILED[r.lifePath];
  if (!detailed) { teaserEl.innerHTML = ''; return; }

  const lockedList = (items, max = 2) => items.slice(0, max).map(item => `<li class="teaser-locked">${item}</li>`).join('')
    + (items.length > max ? `<li class="teaser-locked teaser-more">+ ${items.length - max} mục khác 🔒</li>` : '');

  teaserEl.innerHTML = `
    <div class="teaser-card">
      <div class="teaser-row">
        <span class="teaser-icon">🌟</span>
        <div>
          <div class="teaser-row-title">Chân Dung Số Chủ Đạo ${r.lifePath} — ${detailed.label}</div>
          <p class="teaser-preview">${detailed.coreMeaning[0].slice(0, 90)}… <span class="teaser-locked-inline">🔒 xem đầy đủ 2 đoạn phân tích</span></p>
        </div>
      </div>
      <div class="teaser-row">
        <span class="teaser-icon">💪</span>
        <div>
          <div class="teaser-row-title">Điểm Mạnh</div>
          <ul class="teaser-list">${lockedList(detailed.strengths)}</ul>
        </div>
      </div>
      <div class="teaser-row">
        <span class="teaser-icon">⚠️</span>
        <div>
          <div class="teaser-row-title">Điểm Yếu Cần Lưu Ý</div>
          <ul class="teaser-list">${lockedList(detailed.weaknesses)}</ul>
        </div>
      </div>
      <div class="teaser-row">
        <span class="teaser-icon">✅</span>
        <div>
          <div class="teaser-row-title">Checklist Cải Thiện</div>
          <ul class="teaser-list">${lockedList(detailed.improvementChecklist)}</ul>
        </div>
      </div>
      <div class="teaser-row">
        <span class="teaser-icon">💰</span>
        <div>
          <div class="teaser-row-title">Sự Nghiệp · Tình Duyên · Tài Chính riêng biệt</div>
          <p class="teaser-preview teaser-locked-inline">🔒 3 đoạn gợi ý chuyên sâu, viết riêng cho số ${r.lifePath}</p>
        </div>
      </div>
      <a href="#numerology-pricing" class="btn btn-primary teaser-unlock-btn">🔓 Mở Khóa Báo Cáo Đầy Đủ</a>
    </div>
  `;
}

function initNumerologyForm() {
  const form = document.getElementById('numerologyForm');
  const submitBtn = document.getElementById('numerSubmitBtn');
  const loadingDots = document.getElementById('numerLoadingDots');
  const resultArea = document.getElementById('numerResultArea');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('numerName').value.trim();
    const birthdate = document.getElementById('numerBirthdate').value;
    if (!name || !birthdate) return;

    submitBtn.disabled = true;
    resultArea.classList.remove('visible');
    loadingDots.style.display = 'flex';

    setTimeout(() => {
      const result = computeNumerology(name, birthdate);
      renderNumerologyResult(result);
      loadingDots.style.display = 'none';
      submitBtn.disabled = false;
      resultArea.classList.add('visible');
      resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1200);
  });
}

/* =============================================
   Việc dựng HTML báo cáo PDF thần số học (bản miễn phí & trả phí)
   đã được tách sang file numerology-pdf.js — dùng chung được cho
   cả trang chủ và trang tra-cuu-don-hang.html. Xem file đó cho:
   buildNumerologySharedSections, buildNumerologyPdfHeader,
   buildNumerologyPrintHtml, buildNumerologyPremiumPrintHtml,
   printNumerologyPdf, downloadNumerologyPdf, downloadNumerologyPremiumPdf.
   ============================================= */

/* =============================================
   THANH TOÁN GÓI ĐĂNG KÝ (Checkout / Payment)
   Backend: Supabase Edge Functions (MoMo / VNPay)
   ============================================= */

// Điền URL + anon key sau khi tạo project tại supabase.com
// Xem hướng dẫn đầy đủ trong file HUONG_DAN_DEPLOY.md
const SUPABASE_URL      = 'https://cgfihwtnpvudcqwoukkg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnZmlod3RucHZ1ZGNxd291a2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTM4ODksImV4cCI6MjEwNTQ2OTg4OX0.WAoBhkvmGyPcLdV-rRd5YCtPh7ivdOwhm798hULVkws';

const _sb = (SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Thông tin tài khoản ngân hàng cá nhân nhận chuyển khoản — điền vào đây để
// hiện mã QR VietQR tự động ở bước thanh toán "Chuyển khoản". Tra mã BIN
// ngân hàng của bạn tại https://api.vietqr.io/v2/banks (cột "bin").
// Để trống thì vẫn hoạt động bình thường, chỉ là không hiện được QR.
const BANK_CONFIG = {
  bin: '970423',            // TPBank
  accountNumber: '04100396001',
  accountName: 'DANG BAO NGOC'
};

function vietQrImageUrl(orderCode, amount) {
  if (!BANK_CONFIG.bin || !BANK_CONFIG.accountNumber) return null;
  const acc = encodeURIComponent(BANK_CONFIG.accountName || '');
  return `https://img.vietqr.io/image/${BANK_CONFIG.bin}-${BANK_CONFIG.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(orderCode)}&accountName=${acc}`;
}

// Khối hiển thị QR + thông tin chuyển khoản trong màn hình "Mở khóa thành công"
// khi khách chọn thanh toán bằng Chuyển khoản (chế độ Supabase thật, chưa xác nhận).
function bankTransferBlockHtml(orderCode, amount) {
  const qrUrl = vietQrImageUrl(orderCode, amount);
  if (!qrUrl) {
    return `<p style="color:#f0b429;font-size:0.82rem;margin:10px 0">⚠️ Đội ngũ sẽ liên hệ gửi số tài khoản qua Zalo/SĐT bạn đã cung cấp.</p>`;
  }
  return `
    <div style="text-align:center;margin:14px 0">
      <img src="${qrUrl}" alt="Mã QR chuyển khoản" style="width:220px;max-width:100%;border-radius:12px;border:1px solid rgba(255,255,255,0.1)">
      <p style="color:var(--text-dim);font-size:0.82rem;margin-top:8px;line-height:1.7">
        Quét mã hoặc chuyển khoản thủ công:<br>
        <strong style="color:var(--text)">${BANK_CONFIG.accountName || '—'}</strong> · STK <strong style="color:var(--gold)">${BANK_CONFIG.accountNumber}</strong><br>
        Số tiền: <strong style="color:var(--gold)">${formatVND(amount)} ₫</strong> · Nội dung CK: <strong style="color:var(--gold)">${orderCode}</strong>
      </p>
    </div>`;
}

// Gói mở khóa một lần (không phải thuê bao định kỳ)
const PRICING = {
  'Luận giải toàn bộ': { price: 73000, originalPrice: 315000, save: 77, desc: 'Nền tảng lá số, tính cách và 10 đại vận' },
  'Toàn cảnh vận hạn': { price: 333000, originalPrice: 1540000, save: 78, desc: 'Lộ trình phát triển mỗi 10 năm và theo từng năm' },
  'Toàn thư vận mệnh': { price: 533000, originalPrice: 2437000, save: 78, desc: 'Bản đồ cuộc đời chi tiết & đầy đủ nhất' },
  'Gói Cá Nhân': { price: 100000, originalPrice: 350000, save: 72, desc: '1 báo cáo PDF đầy đủ cho chính bạn' },
  'Gói Yêu Thương': { price: 180000, originalPrice: 700000, save: 75, desc: '2 báo cáo PDF — dành cho cặp đôi, bạn bè' },
  'Gói Gia Đình': { price: 290000, originalPrice: 1400000, save: 80, desc: '4 báo cáo PDF — trọn bộ cho cả gia đình' }
};

// Các gói giao PDF qua Zalo (khác luồng "mở khóa báo cáo trên web" của gói tử vi)
const NUMEROLOGY_PDF_PLANS = new Set(['Gói Cá Nhân', 'Gói Yêu Thương', 'Gói Gia Đình']);

let currentCheckout = null; // { plan, amount }

function formatVND(n) {
  return n.toLocaleString('vi-VN');
}

function initCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  const closeBtn = document.getElementById('checkoutClose');
  const form = document.getElementById('checkoutForm');
  const paymentSelect = document.getElementById('coPayment');

  closeBtn.addEventListener('click', closeCheckoutModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeCheckoutModal(); });
  paymentSelect.addEventListener('change', updateCheckoutPaymentInfo);
  form.addEventListener('submit', submitCheckout);
}

function openCheckoutModal(plan) {
  const pricing = PRICING[plan];
  if (!pricing) return;

  currentCheckout = { plan, amount: pricing.price };

  document.getElementById('coPlanBadge').textContent = plan;
  document.getElementById('coPlanName').textContent = plan;
  document.getElementById('coPriceOld').textContent = formatVND(pricing.originalPrice) + ' ₫';
  document.getElementById('coAmount').textContent = formatVND(pricing.price);
  document.getElementById('coSaveLabel').textContent = `Tiết kiệm ${pricing.save}%`;
  document.getElementById('coPlanDesc').textContent = pricing.desc;

  const form = document.getElementById('checkoutForm');
  form.reset();
  form.style.display = 'flex';
  document.getElementById('checkoutSuccess').style.display = 'none';
  updateCheckoutPaymentInfo();

  document.getElementById('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

function updateCheckoutPaymentInfo() {
  const method = document.getElementById('coPayment').value;
  const info = document.getElementById('coPaymentInfo');
  const map = {
    momo: '💜 <strong>MoMo</strong> — Bạn sẽ được chuyển sang trang thanh toán MoMo an toàn sau khi xác nhận.',
    vnpay: '🏧 <strong>VNPay</strong> — Thanh toán qua ATM / Thẻ ngân hàng / QR trên cổng VNPay.',
    transfer: '🏦 <strong>Chuyển khoản</strong> — Đội ngũ sẽ gửi số tài khoản qua SĐT/email bạn cung cấp trong vòng 15 phút.'
  };
  info.innerHTML = map[method] || '';
}

// Gọi Supabase Edge Function để tạo link thanh toán MoMo / VNPay
async function createPaymentUrl(method, orderCode, amount) {
  if (!_sb) {
    // Chưa cấu hình Supabase thật (xem HUONG_DAN_DEPLOY.md) → mô phỏng cục bộ
    // luồng "thanh toán thành công" để test giao diện/trải nghiệm ngay, không
    // gọi cổng MoMo/VNPay thật. Tự động tắt ngay khi điền SUPABASE_URL/KEY.
    const resultParam = method === 'momo' ? 'resultCode=0' : 'vnp_ResponseCode=00';
    return `payment-result.html?method=${method}&order=${orderCode}&${resultParam}&mock=1`;
  }
  try {
    const fnName = method === 'momo' ? 'momo-pay' : 'vnpay-pay';
    const { data, error } = await _sb.functions.invoke(fnName, {
      body: { orderCode, amount, orderInfo: `Thien Co AI - ${orderCode}` }
    });
    if (error || !data?.ok) return null;
    return data.payUrl;
  } catch {
    return null;
  }
}

function validatePhoneNumber(phone) {
  return /^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s/g, ''));
}

async function submitCheckout(e) {
  e.preventDefault();
  if (!currentCheckout) return;

  const name = document.getElementById('coName').value.trim();
  const phone = document.getElementById('coPhone').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const payment = document.getElementById('coPayment').value;

  if (!validatePhoneNumber(phone)) {
    document.getElementById('coPhone').focus();
    alert('Số điện thoại không hợp lệ. Vui lòng nhập lại (VD: 0912345678).');
    return;
  }

  const submitBtn = document.getElementById('checkoutSubmitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Đang xử lý…';

  const { plan, amount } = currentCheckout;
  const orderCode = 'TCA' + Date.now().toString().slice(-6);
  const isNumerologyPdf = NUMEROLOGY_PDF_PLANS.has(plan);

  // Ghi nhận đơn mở khóa vào Supabase (nếu đã cấu hình). Lưu kèm payload —
  // {name, birthdate} cho gói thần số học, hoặc {name, birthdate, birthtime,
  // birthplace, gender} cho gói tử vi — để tính lại đúng báo cáo của khách
  // khi đơn được admin duyệt "Đã thanh toán" (xem tra-cuu-don-hang.html).
  let checkoutPayload = null;
  if (isNumerologyPdf && lastNumerologyResult) {
    checkoutPayload = { name: lastNumerologyResult.name, birthdate: lastNumerologyResult.birthdate };
  } else if (!isNumerologyPdf && lastTuviResult) {
    checkoutPayload = {
      name: lastTuviResult.name, birthdate: lastTuviResult.birthdate,
      birthtime: lastTuviResult.birthtime, birthplace: lastTuviResult.birthplace, gender: lastTuviResult.gender
    };
  }
  if (_sb) {
    try {
      await _sb.from('subscriptions').insert({
        order_code: orderCode, name, phone, email: email || null,
        plan, billing_cycle: 'one_time', amount, payment_method: payment, status: 'pending',
        payload: checkoutPayload
      });
    } catch { /* không chặn luồng nếu bảng chưa được tạo */ }
  }

  // MoMo / VNPay → chuyển hướng sang cổng thanh toán thật
  if (payment === 'momo' || payment === 'vnpay') {
    const payUrl = await createPaymentUrl(payment, orderCode, amount);
    if (payUrl) {
      window.location.href = payUrl;
      return;
    }
  }

  // Tới đây nghĩa là: chọn "Chuyển khoản" (không cần redirect), hoặc cổng
  // MoMo/VNPay thật đã cấu hình nhưng gọi API thất bại (mock demo luôn redirect ở trên)
  submitBtn.disabled = false;
  submitBtn.textContent = 'Xác Nhận Mở Khóa';

  const paymentLabel = { momo: 'MoMo', vnpay: 'VNPay', transfer: 'Chuyển khoản ngân hàng' }[payment];
  const gatewayNote = (payment === 'momo' || payment === 'vnpay')
    ? '<p style="color:#f0b429;font-size:0.82rem;margin-top:10px">⚠️ Cổng thanh toán gặp sự cố khi kết nối. Đơn của bạn đã được ghi nhận, đội ngũ sẽ liên hệ xác nhận thủ công.</p>'
    : '';

  let confirmLine, reportAction;

  if (isNumerologyPdf) {
    if (_sb) {
      // CHẾ ĐỘ THẬT (đã cấu hình Supabase): đơn ở trạng thái "chờ xác nhận" cho
      // tới khi bạn kiểm tra đã nhận được tiền và duyệt đơn trong admin.html —
      // KHÔNG mở khóa PDF ngay, kể cả khi đã có lastNumerologyResult.
      const lookupUrl = `tra-cuu-don-hang.html?order=${orderCode}`;
      confirmLine = payment === 'transfer'
        ? `Đơn của bạn đang <strong>chờ xác nhận thanh toán</strong>. Sau khi chuyển khoản đúng nội dung bên dưới, đội ngũ sẽ duyệt đơn trong vài giờ.`
        : `Đơn của bạn đang <strong>chờ xác nhận thanh toán</strong>. Đội ngũ sẽ liên hệ qua Zalo/SĐT <strong>${phone}</strong> để xác nhận ${paymentLabel}.`;
      reportAction = `
        ${payment === 'transfer' ? bankTransferBlockHtml(orderCode, amount) : ''}
        <p style="color:var(--text-dim); font-size:0.85rem; margin:4px 0 10px">Lưu lại mã đơn ở trên, hoặc quay lại link này bất cứ lúc nào để tải file PDF ngay khi đơn được duyệt:</p>
        <a href="${lookupUrl}" class="btn-submit" style="text-decoration:none; box-sizing:border-box; display:flex;">🔍 Tra Cứu Đơn Hàng Này</a>
        <button type="button" class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:10px" onclick="closeCheckoutModal()">Đóng</button>`;
    } else {
      // CHẾ ĐỘ MÔ PHỎNG (chưa cấu hình Supabase thật) — giữ nguyên hành vi mở
      // khóa PDF ngay để bạn test giao diện/trải nghiệm mà không cần backend.
      confirmLine = lastNumerologyResult
        ? `Bạn có thể tải file PDF ngay bên dưới. Đội ngũ cũng sẽ liên hệ qua Zalo/SĐT <strong>${phone}</strong> để hỗ trợ thêm nếu cần (${paymentLabel}).`
        : `Đội ngũ sẽ liên hệ qua Zalo/SĐT <strong>${phone}</strong> để xác nhận ${paymentLabel} và gửi file PDF thần số học trong vòng 30 phút.`;
      reportAction = lastNumerologyResult
        ? `<button type="button" class="btn-submit" onclick="downloadNumerologyPremiumPdf('${plan.replace(/'/g, "\\'")}')">📄 Tải File PDF Ngay</button>
           <button type="button" class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:10px" onclick="closeCheckoutModal()">Đóng</button>`
        : `<p style="color:var(--text-dim); font-size:0.85rem; margin-top:4px">Hãy tính thần số học miễn phí ở mục trên trước, sau đó quay lại đây để tải file PDF ngay.</p>
           <a href="#numerology-section" onclick="closeCheckoutModal()" class="btn-submit" style="text-decoration:none; box-sizing:border-box;">Tính Thần Số Học Miễn Phí</a>
           <button type="button" class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:10px" onclick="closeCheckoutModal()">Đóng</button>`;
    }
  } else if (_sb) {
    // CHẾ ĐỘ THẬT (đã cấu hình Supabase): đơn ở trạng thái "chờ xác nhận" cho
    // tới khi bạn duyệt đơn trong admin.html — KHÔNG hiện báo cáo chi tiết
    // ngay, kể cả khi đã có lastTuviResult.
    const lookupUrl = `tra-cuu-don-hang.html?order=${orderCode}`;
    confirmLine = payment === 'transfer'
      ? `Đơn của bạn đang <strong>chờ xác nhận thanh toán</strong>. Sau khi chuyển khoản đúng nội dung bên dưới, đội ngũ sẽ duyệt đơn trong vài giờ.`
      : `Đơn của bạn đang <strong>chờ xác nhận thanh toán</strong>. Đội ngũ sẽ liên hệ qua Zalo/SĐT <strong>${phone}</strong> để xác nhận ${paymentLabel}.`;
    reportAction = `
      ${payment === 'transfer' ? bankTransferBlockHtml(orderCode, amount) : ''}
      <p style="color:var(--text-dim); font-size:0.85rem; margin:4px 0 10px">Lưu lại mã đơn ở trên, hoặc quay lại link này bất cứ lúc nào để xem báo cáo chi tiết ngay khi đơn được duyệt:</p>
      <a href="${lookupUrl}" class="btn-submit" style="text-decoration:none; box-sizing:border-box; display:flex;">🔍 Tra Cứu Đơn Hàng Này</a>
      <button type="button" class="btn btn-secondary" style="width:100%;justify-content:center;margin-top:10px" onclick="closeCheckoutModal()">Đóng</button>`;
  } else {
    // CHẾ ĐỘ MÔ PHỎNG (chưa cấu hình Supabase thật) — giữ nguyên hành vi dựng
    // báo cáo ngay để bạn test giao diện/trải nghiệm mà không cần backend.
    confirmLine = `Chúng tôi sẽ gọi tới <strong>${phone}</strong> để xác nhận và hướng dẫn ${paymentLabel} trong vòng 15 phút.`;
    reportAction = lastTuviResult
      ? `<button type="button" class="btn-submit" onclick="closeCheckoutModal(); document.getElementById('premium-report-section').scrollIntoView({behavior:'smooth'});">Xem Báo Cáo Chi Tiết Ngay</button>`
      : `<p style="color:var(--text-dim); font-size:0.85rem; margin-top:4px">Hãy <a href="#form-section" onclick="closeCheckoutModal()" style="color:var(--gold)">lập lá số miễn phí</a> ở mục trên để AI dựng báo cáo chi tiết cho gói bạn vừa mở khóa.</p>
         <button type="button" class="btn-submit" onclick="closeCheckoutModal()">Đóng</button>`;
  }

  document.getElementById('checkoutForm').style.display = 'none';
  const successEl = document.getElementById('checkoutSuccess');
  successEl.style.display = 'block';
  successEl.innerHTML = `
    <div class="result-icon">🎉</div>
    <h4>Mở khóa thành công!</h4>
    <p>Cảm ơn <strong>${name}</strong>! <strong>${plan}</strong> của bạn đã được ghi nhận.<br>${confirmLine}</p>
    <div class="checkout-order-code">${orderCode}</div>
    ${gatewayNote}
    ${reportAction}
  `;

  // Chỉ tự render báo cáo ngay ở chế độ mô phỏng (chưa cấu hình Supabase thật).
  // Ở chế độ thật, báo cáo chỉ hiện sau khi đơn được duyệt (xem checkTuviOrderFromUrl).
  if (!isNumerologyPdf && !_sb && lastTuviResult) renderPremiumReport(plan, lastTuviResult);
}

// Sau khi admin duyệt đơn tử vi trả phí, link "Tra Cứu Đơn Hàng Này" đưa khách
// về đây với ?tuvi_order=<mã đơn> — tự tính lại lá số từ payload đã lưu và
// hiện thẳng báo cáo chi tiết, không cần nhập lại thông tin.
async function checkTuviOrderFromUrl() {
  const orderCode = new URLSearchParams(location.search).get('tuvi_order');
  if (!orderCode || !_sb) return;
  try {
    const { data, error } = await _sb.from('subscriptions').select('*').eq('order_code', orderCode).maybeSingle();
    if (error || !data) return;
    if (data.status !== 'paid' || !data.payload) {
      alert('Đơn hàng này chưa được xác nhận thanh toán. Vui lòng tra cứu lại sau hoặc liên hệ hỗ trợ.');
      return;
    }
    const p = data.payload;
    const result = computeTuvi(p.name, p.birthdate, p.birthtime, p.birthplace, p.gender);
    renderPremiumReport(data.plan, result);
    document.getElementById('premium-report-section').scrollIntoView({ behavior: 'smooth' });
  } catch { /* lỗi mạng/kết nối — im lặng bỏ qua, khách có thể tra cứu lại sau */ }
}

/* =============================================
   AI LUẬN GIẢI CHUYÊN SÂU (báo cáo mở khóa)
   Mở rộng từ engine Tử Vi: Cục số thật + 10 Đại Vận,
   vận hạn theo năm và bản đồ cuộc đời — tạo hoàn toàn
   trong trình duyệt (miễn phí, không cần API ngoài).
   ============================================= */

// Mỗi cung trong 12 cung số quản một lĩnh vực cuộc sống riêng — dùng để
// "đặt màu sắc" cho sao thực tế đang trấn giữ cung đó trong từng Đại Vận.
const PALACE_DOMAIN = {
  'Mệnh': 'vận trình tổng quát của bản thân',
  'Phụ Mẫu': 'quan hệ với cha mẹ, cấp trên và quý nhân',
  'Phúc Đức': 'đời sống tinh thần, phúc phần và sự an yên nội tâm',
  'Điền Trạch': 'nhà cửa, đất đai và nơi an cư',
  'Quan Lộc': 'sự nghiệp, công danh',
  'Nô Bộc': 'bạn bè, đối tác và các mối quan hệ hợp tác',
  'Thiên Di': 'việc đi xa, thay đổi môi trường sống và giao tiếp xã hội',
  'Tật Ách': 'sức khỏe và những vấn đề cần phòng tránh',
  'Tài Bạch': 'tiền bạc, tài chính',
  'Tử Tức': 'con cái và các dự án do mình tạo dựng',
  'Phu Thê': 'hôn nhân và tình cảm đôi lứa',
  'Huynh Đệ': 'anh chị em và những người đồng hành gần gũi'
};

// Với những cung có "field" tương ứng sẵn trong TUVI_STAR_CONTENT, ưu tiên
// dùng đúng field đó cho Vận Niên (yearly) để nội dung sát chủ đề hơn.
const PALACE_FIELD = { 'Quan Lộc': 'career', 'Tài Bạch': 'wealth', 'Phu Thê': 'love', 'Tật Ách': 'health' };

function firstSentence(text) {
  const idx = text.indexOf('. ');
  return idx === -1 ? text : text.slice(0, idx + 1);
}

// Quan hệ Ngũ Hành tương sinh / tương khắc giữa Nạp Âm năm lưu niên và bản
// mệnh của gia chủ — dùng để mỗi năm trong "Vận Hạn 10 Năm Tới" có nội dung
// thực sự riêng biệt (thay vì lặp lại y nguyên câu của cả giai đoạn Đại Vận
// 10 năm), dựa trên nguyên lý ngũ hành cổ truyền chứ không phải suy diễn.
const NGU_HANH_SINH = { 'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim' };
const NGU_HANH_KHAC = { 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim' };

/* =============================================
   MIẾU / VƯỢNG / ĐẮC / BÌNH HÒA / HÃM — theo quan hệ Ngũ Hành
   ---------------------------------------------
   LƯU Ý PHƯƠNG PHÁP: bảng Miếu/Vượng/Đắc/Hãm truyền thống cho từng
   sao tại từng cung (168 tổ hợp) không có nguồn tổng hợp đầy đủ,
   đáng tin cậy và thống nhất giữa các trường phái tử vi — nên KHÔNG
   dùng bảng cổ truyền ở đây để tránh bịa số liệu sai. Thay vào đó,
   độ mạnh/yếu của sao được suy ra từ quan hệ Ngũ Hành (sinh/khắc)
   giữa bản chất Ngũ Hành của sao và Ngũ Hành của Chi nơi sao tọa —
   một nguyên lý gốc rễ của tử vi, tính nhất quán, minh bạch, mang
   tính tham khảo (không phải bảng cổ truyền chính xác 100%).
   ============================================= */
const STAR_NGU_HANH = {
  'Tử Vi': 'Thổ', 'Thiên Cơ': 'Mộc', 'Thái Dương': 'Hỏa', 'Vũ Khúc': 'Kim',
  'Thiên Đồng': 'Thủy', 'Liêm Trinh': 'Hỏa', 'Thiên Phủ': 'Thổ', 'Thái Âm': 'Thủy',
  'Tham Lang': 'Mộc', 'Cự Môn': 'Thủy', 'Thiên Tướng': 'Thủy', 'Thiên Lương': 'Mộc',
  'Thất Sát': 'Kim', 'Phá Quân': 'Thủy'
};
const CHI_NGU_HANH = {
  'Tý': 'Thủy', 'Sửu': 'Thổ', 'Dần': 'Mộc', 'Mão': 'Mộc', 'Thìn': 'Thổ', 'Tỵ': 'Hỏa',
  'Ngọ': 'Hỏa', 'Mùi': 'Thổ', 'Thân': 'Kim', 'Dậu': 'Kim', 'Tuất': 'Thổ', 'Hợi': 'Thủy'
};
const DIGNITY_INFO = {
  M: { label: 'Miếu', desc: 'được Chi sinh nhập — cực vượng' },
  V: { label: 'Vượng', desc: 'cùng hành với Chi — thịnh vượng' },
  D: { label: 'Đắc', desc: 'khắc xuất Chi — chủ động, có lực' },
  B: { label: 'Bình hòa', desc: 'sinh xuất cho Chi — trung bình, hao nhẹ' },
  H: { label: 'Hãm', desc: 'bị Chi khắc nhập — suy yếu' }
};
// Trả về { code, label } — độ mạnh/yếu của 1 chính tinh khi đóng tại 1 Chi cụ thể
function starDignity(starName, chiTen) {
  const saoHanh = STAR_NGU_HANH[starName];
  const chiHanh = CHI_NGU_HANH[chiTen];
  if (!saoHanh || !chiHanh) return null;
  let code;
  if (NGU_HANH_SINH[chiHanh] === saoHanh) code = 'M';
  else if (saoHanh === chiHanh) code = 'V';
  else if (NGU_HANH_KHAC[saoHanh] === chiHanh) code = 'D';
  else if (NGU_HANH_SINH[saoHanh] === chiHanh) code = 'B';
  else if (NGU_HANH_KHAC[chiHanh] === saoHanh) code = 'H';
  else return null;
  return { code, label: DIGNITY_INFO[code].label };
}

function nguHanhLuuNienText(yearHanh, banMenh) {
  if (yearHanh === banMenh) {
    return `Ngũ hành năm nay (${yearHanh}) tương hòa với bản mệnh ${banMenh} — vận trình ổn định, thuận theo tự nhiên, không có biến động lớn.`;
  }
  if (NGU_HANH_SINH[yearHanh] === banMenh) {
    return `Ngũ hành năm nay (${yearHanh}) sinh nhập cho bản mệnh ${banMenh} — được tiếp sức, dễ gặp may mắn và quý nhân phù trợ, mọi việc hanh thông hơn hẳn.`;
  }
  if (NGU_HANH_SINH[banMenh] === yearHanh) {
    return `Bản mệnh ${banMenh} sinh xuất cho ngũ hành năm nay (${yearHanh}) — dễ hao tổn tâm sức, tiền bạc cho người khác hoặc công việc chung, nên giữ sức và tránh cho đi quá nhiều mà quên bồi đắp lại cho bản thân.`;
  }
  if (NGU_HANH_KHAC[yearHanh] === banMenh) {
    return `Ngũ hành năm nay (${yearHanh}) khắc nhập bản mệnh ${banMenh} — cần thận trọng, dễ gặp trở ngại hoặc hao tổn sức khỏe nếu không giữ tâm thái bình tĩnh, tránh nóng vội.`;
  }
  if (NGU_HANH_KHAC[banMenh] === yearHanh) {
    return `Bản mệnh ${banMenh} khắc xuất ngũ hành năm nay (${yearHanh}) — bạn ở thế chủ động chế ngự hoàn cảnh, có phần vất vả nhưng nỗ lực đúng hướng vẫn làm chủ được tình thế.`;
  }
  return '';
}

function starsOfCungIdx(r, cungIdx) {
  const cung = r.cungList[cungIdx];
  const names = cung.sao && cung.sao.length ? cung.sao : ['Vô Chính Diệu'];
  return { cung, names };
}

// Đại Vận (10 giai đoạn 10 năm) — luận theo ĐÚNG sao đang trấn giữ cung mà
// đại vận đi qua trong lá số của từng người (không còn câu random theo seed).
function generateDaiVan(r) {
  const list = [];
  for (let i = 0; i < 10; i++) {
    const ageStart = r.cuc.socuc + i * 10;
    const ageEnd = ageStart + 9;
    const cungIdx = r.thuanLy ? (r.menhIdx + i) % 12 : ((r.menhIdx - i) % 12 + 12) % 12;
    const { cung, names } = starsOfCungIdx(r, cungIdx);
    const domain = PALACE_DOMAIN[cung.tenCung] || 'vận trình chung';
    const starText = names.map(n => {
      const p = TUVI_STAR_CONTENT[n];
      return p ? `${n === 'Vô Chính Diệu' ? 'Vô Chính Diệu' : `Sao ${n}`}: ${firstSentence(p.coreMeaning[0])}` : '';
    }).filter(Boolean).join(' ');
    list.push({
      ageStart, ageEnd,
      ageRange: `${ageStart} - ${ageEnd} tuổi`,
      title: `Đại Vận ${i + 1}: Cung ${cung.tenCung} (${cung.chiTen})`,
      text: `Giai đoạn này thiên về ${domain}. ${starText}`
    });
  }
  return { cuc: { ten: r.cuc.tenCuc }, list };
}

// Timeline trực quan 10 Đại Vận — hàm thuần trả về chuỗi HTML chứa <svg> inline,
// cùng phong cách với buildNguHanhChartHtmlFromCounts (geometry bằng JS thuần,
// màu sắc/style qua class CSS). birthdate (tùy chọn) dùng để tô đậm đại vận hiện tại.
function buildDaiVanTimelineHtml(daiVanList, birthdate) {
  const w = 640, h = 130, padX = 10, barY = 40, barH = 28;
  const totalAge = daiVanList[daiVanList.length - 1].ageEnd;
  const firstAge = daiVanList[0].ageStart;
  const span = totalAge - firstAge || 1;
  const xOf = age => padX + ((age - firstAge) / span) * (w - padX * 2);

  let currentAge = null;
  if (birthdate) {
    const birth = new Date(birthdate + 'T00:00:00');
    const now = new Date();
    currentAge = now.getFullYear() - birth.getFullYear() - ((now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) ? 1 : 0);
  }

  const segHtml = daiVanList.map((d, i) => {
    const x1 = xOf(d.ageStart), x2 = xOf(d.ageEnd + 1);
    const isCurrent = currentAge !== null && currentAge >= d.ageStart && currentAge <= d.ageEnd;
    return `
      <rect x="${x1}" y="${barY}" width="${Math.max(1, x2 - x1 - 2)}" height="${barH}" rx="4"
        class="daivan-seg${isCurrent ? ' daivan-seg-current' : ''}"/>
      <text x="${(x1 + x2) / 2}" y="${barY + barH / 2 + 4}" text-anchor="middle" class="daivan-seg-label">${d.ageStart}</text>
      <text x="${(x1 + x2) / 2}" y="${barY + barH + 16}" text-anchor="middle" class="daivan-seg-title">${i + 1}</text>`;
  }).join('');

  const currentMarkerHtml = currentAge !== null && currentAge >= firstAge && currentAge <= totalAge
    ? `<line x1="${xOf(currentAge)}" y1="${barY - 8}" x2="${xOf(currentAge)}" y2="${barY + barH + 8}" class="daivan-now-line"/>
       <text x="${xOf(currentAge)}" y="${barY - 12}" text-anchor="middle" class="daivan-now-label">Hiện tại (${currentAge} tuổi)</text>`
    : '';

  return `
    <div class="daivan-timeline-wrap">
      <div class="nguhanh-chart-title">📈 Timeline 10 Đại Vận</div>
      <div class="nguhanh-chart-desc">Mỗi ô là 1 giai đoạn 10 năm theo đúng lá số — số bên dưới là thứ tự đại vận, số trong ô là tuổi bắt đầu.</div>
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" xmlns="http://www.w3.org/2000/svg">
        ${segHtml}
        ${currentMarkerHtml}
      </svg>
    </div>`;
}

// Vận Hạn 10 Năm Tới — mỗi năm được gắn với đúng giai đoạn Đại Vận (và do đó
// đúng cung/sao thực tế) mà năm đó rơi vào, ưu tiên khía cạnh phù hợp với
// cung đó (sự nghiệp/tài lộc/tình duyên/sức khỏe), CỘNG THÊM quan hệ Ngũ Hành
// tương sinh/tương khắc thực tế giữa Nạp Âm của từng năm và bản mệnh gia chủ
// — để mỗi năm trong 10 năm có nội dung thực sự khác nhau ngay cả khi cùng
// nằm trong một giai đoạn Đại Vận (trước đây từng lặp y nguyên 1 đoạn văn
// cho cả 10 năm nếu chúng rơi vào cùng 1 đại vận). Đây vẫn là bản giản lược
// dựa trên Đại Vận + Ngũ Hành lưu niên — chưa tính Lưu Niên đầy đủ (sao lưu
// chuyển riêng theo từng năm cụ thể), một hướng nâng cấp sâu hơn có thể làm sau.
function generateYearly(r) {
  const currentYear = new Date().getFullYear();
  const birthYear = new Date(r.birthdate + 'T00:00:00').getFullYear();
  const list = [];
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i;
    const age = year - birthYear;
    const dvIdx = Math.max(0, Math.min(9, Math.floor((age - r.cuc.socuc) / 10)));
    const cungIdx = r.thuanLy ? (r.menhIdx + dvIdx) % 12 : ((r.menhIdx - dvIdx) % 12 + 12) % 12;
    const { cung, names } = starsOfCungIdx(r, cungIdx);
    const field = PALACE_FIELD[cung.tenCung] || null;
    const starText = names.map(n => {
      const p = TUVI_STAR_CONTENT[n];
      if (!p) return '';
      return field ? p[field] : firstSentence(p.coreMeaning[0]);
    }).filter(Boolean).join(' ');

    const { canIdx, chiIdx } = canChiNam(year);
    const yearCanChi = `${CAN[canIdx]} ${CHI[chiIdx]}`;
    const yearHanh = napAmToNguHanh(napAmOf(canIdx, chiIdx));
    const hanhText = nguHanhLuuNienText(yearHanh, r.menh);

    list.push({
      year, age,
      text: `Năm ${yearCanChi} (${yearHanh}). ${hanhText} Xét theo giai đoạn Đại Vận cung ${cung.tenCung} (${PALACE_DOMAIN[cung.tenCung] || ''}) đang đi qua: ${starText}`
    });
  }
  return list;
}

function generateLifeMapExtra(r) {
  return {
    loveStages: `Thời trẻ (dưới 30 tuổi): tình cảm nhiều trải nghiệm, chưa ổn định lâu dài. Trung niên (30-50 tuổi): hôn nhân và gia đình dần đi vào ổn định, trở thành trụ cột cảm xúc cho người thân. Hậu vận (sau 50 tuổi): viên mãn, con cái trưởng thành, tận hưởng thành quả đã vun đắp cả đời.`,
    advice: `Với bản mệnh ${r.menh} và sao ${r.sao} thủ mệnh, chìa khóa thành công của ${r.name} nằm ở việc kiên trì theo đuổi mục tiêu dài hạn, biết lúc nào nên tiến, lúc nào nên lùi theo từng giai đoạn đại vận. Giữ tâm thái an nhiên và tích lũy phúc đức sẽ giúp hóa giải phần lớn vận hạn xấu trong đời.`
  };
}

// Dựng "Chân Dung Mệnh Chủ" — luận giải chi tiết theo ĐÚNG (các) chính tinh
// thực sự đang thủ Cung Mệnh của từng lá số (TUVI_STAR_CONTENT), thay vì
// đoạn văn ngẫu nhiên xoay vòng theo seed như trước. Trường hợp 2 chính
// tinh đồng cung (vd Tử Vi - Phá Quân) sẽ hiện lần lượt ảnh hưởng của
// từng sao thành các khối riêng.
function buildMenhProfileHtml(r) {
  const starNames = r.sao === 'Vô Chính Diệu' ? ['Vô Chính Diệu'] : r.sao.split(' - ');
  const profiles = starNames.map(name => TUVI_STAR_CONTENT[name]).filter(Boolean);

  if (!profiles.length) {
    return `<div class="result-block"><p>Chưa có dữ liệu luận giải chi tiết cho tổ hợp sao này.</p></div>`;
  }

  const introBlock = profiles.length > 1
    ? `<div class="result-block"><div class="result-block-title">🌟 ${starNames.join(' - ')} đồng cung tại Mệnh</div><p>Cung Mệnh của ${r.name} có ${starNames.length} chính tinh cùng tọa thủ — tính cách và vận số được định hình bởi sự kết hợp ảnh hưởng của cả hai sao dưới đây.</p></div>`
    : '';

  const starBlocks = profiles.map((p, i) => `
    <div class="result-block">
      <div class="result-block-title">${profiles.length > 1 ? `Ảnh hưởng của sao ${starNames[i]}` : `🌟 ${starNames[i]} — ${p.label}`}</div>
      ${p.coreMeaning.map(para => `<p>${para}</p>`).join('')}
    </div>
    <div class="result-block">
      <div class="result-block-title">💪 Điểm Mạnh (${starNames[i]})</div>
      <ul class="plan-features">${p.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="result-block">
      <div class="result-block-title">⚠️ Điểm Cần Lưu Ý (${starNames[i]})</div>
      <ul class="weakness-list">${p.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul>
    </div>
    <div class="result-block"><div class="result-block-title">💼 Sự Nghiệp</div><p>${p.career}</p></div>
    <div class="result-block"><div class="result-block-title">💗 Tình Duyên</div><p>${p.love}</p></div>
    <div class="result-block"><div class="result-block-title">💰 Tài Lộc</div><p>${p.wealth}</p></div>
    <div class="result-block"><div class="result-block-title">🩺 Sức Khỏe</div><p>${p.health}</p></div>
    <div class="result-block"><div class="result-block-title">🧭 Lời Khuyên</div><p>${p.advice}</p></div>
  `).join('');

  return introBlock + starBlocks;
}

// "4 Cung Trọng Yếu" — Cung Thân (nửa sau cuộc đời), Quan Lộc (sự nghiệp),
// Tài Bạch (tài lộc), Phu Thê (hôn nhân) — luận theo ĐÚNG sao thực tế đang
// trấn giữ từng cung đó trong lá số, tái dùng nội dung gốc của từng sao
// (TUVI_STAR_CONTENT) nhưng khoanh vào đúng khía cạnh của cung tương ứng
// (career/wealth/love), thay vì viết riêng 14 sao x 4 cung từ đầu.
function buildFourPalacesHtml(r) {
  const thanCung = r.cungList.find(c => c.laThan);

  function palaceBlock(icon, title, tenCung, field) {
    const cung = r.cungList.find(c => c.tenCung === tenCung);
    if (!cung) return '';
    const names = cung.sao && cung.sao.length ? cung.sao : ['Vô Chính Diệu'];
    const body = names.map(n => {
      const p = TUVI_STAR_CONTENT[n];
      if (!p) return '';
      const text = field === 'core' ? p.coreMeaning[0] : p[field];
      const label = n === 'Vô Chính Diệu' ? '' : ` (${p.label})`;
      return `<p><strong style="color:var(--gold)">${n}${label}:</strong> ${text}</p>`;
    }).join('');
    return `
      <div class="result-block">
        <div class="result-block-title">${icon} Cung ${tenCung} — ${title} <span style="color:var(--text-dim);font-weight:400">(tại ${cung.chiTen})</span></div>
        ${body}
      </div>`;
  }

  let thanBlock = '';
  if (thanCung) {
    if (thanCung.laMenh) {
      thanBlock = `
        <div class="result-block">
          <div class="result-block-title">🌗 Cung Thân — Nửa Sau Cuộc Đời</div>
          <p>Cung Thân của ${r.name} đồng cung với Mệnh — tính cách cốt lõi và vận trình nửa sau cuộc đời gắn liền làm một, không tách rời (xem phần "Chân Dung Mệnh Chủ" ở trên để biết chi tiết).</p>
        </div>`;
    } else {
      const names = thanCung.sao && thanCung.sao.length ? thanCung.sao : ['Vô Chính Diệu'];
      const body = names.map(n => {
        const p = TUVI_STAR_CONTENT[n];
        if (!p) return '';
        const label = n === 'Vô Chính Diệu' ? '' : ` (${p.label})`;
        return `<p><strong style="color:var(--gold)">${n}${label}:</strong> ${p.coreMeaning[0]}</p>`;
      }).join('');
      thanBlock = `
        <div class="result-block">
          <div class="result-block-title">🌗 Cung Thân — Nửa Sau Cuộc Đời <span style="color:var(--text-dim);font-weight:400">(tại ${thanCung.chiTen})</span></div>
          <p style="color:var(--text-dim);font-size:0.85rem;margin-bottom:8px">Cung Thân bổ sung cho Mệnh, thể hiện rõ nét nhất từ trung niên trở về sau:</p>
          ${body}
        </div>`;
    }
  }

  return thanBlock
    + palaceBlock('💼', 'Sự Nghiệp & Công Danh', 'Quan Lộc', 'career')
    + palaceBlock('💰', 'Tài Lộc', 'Tài Bạch', 'wealth')
    + palaceBlock('💗', 'Hôn Nhân & Bạn Đời', 'Phu Thê', 'love');
}

function renderPremiumReport(plan, r) {
  document.getElementById('premReportBadge').textContent = plan;
  document.getElementById('premReportTitle').textContent = `Báo Cáo Chi Tiết Của ${r.name}`;
  document.getElementById('premReportMeta').textContent =
    `Bản mệnh ${r.menh} · Cung Mệnh tại ${r.chiMenh} · Sao ${r.sao} · Năm ${r.canChi}`;

  document.getElementById('premMenhProfileList').innerHTML = buildMenhProfileHtml(r);
  document.getElementById('premFourPalacesList').innerHTML = buildFourPalacesHtml(r);

  const { cuc, list: daiVanList } = generateDaiVan(r);
  document.getElementById('premCucName').textContent = cuc.ten;
  const daiVanChartEl = document.getElementById('premDaiVanChart');
  if (daiVanChartEl) daiVanChartEl.innerHTML = buildDaiVanTimelineHtml(daiVanList, r.birthdate);
  document.getElementById('premDaiVanList').innerHTML = daiVanList.map(d => `
    <div class="result-block">
      <div class="result-block-title">${d.ageRange} — ${d.title}</div>
      <p>${d.text}</p>
    </div>
  `).join('');
  document.getElementById('premDaiVanBlock').style.display = 'block';

  const showYearly = plan !== 'Luận giải toàn bộ';
  document.getElementById('premYearlyBlock').style.display = showYearly ? 'block' : 'none';
  if (showYearly) {
    document.getElementById('premYearlyList').innerHTML = generateYearly(r).map(y => `
      <div class="result-block">
        <div class="result-block-title">Năm ${y.year} (${y.age} tuổi)</div>
        <p>${y.text}</p>
      </div>
    `).join('');
  }

  const showLifeMap = plan === 'Toàn thư vận mệnh';
  document.getElementById('premLifeMapBlock').style.display = showLifeMap ? 'block' : 'none';
  if (showLifeMap) {
    const extra = generateLifeMapExtra(r);
    document.getElementById('premLoveStages').textContent = extra.loveStages;
    document.getElementById('premAdvice').textContent = extra.advice;
  }

  document.getElementById('premium-report-section').style.display = 'block';
}
