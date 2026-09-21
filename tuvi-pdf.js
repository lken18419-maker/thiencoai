/* =============================================
   XUẤT PDF BÁO CÁO TỬ VI TRẢ PHÍ
   Cùng cơ chế window.print() + CSS @media print như
   numerology-pdf.js. Tái dùng lại CHÍNH các hàm dựng nội
   dung đã có (buildMenhProfileHtml, buildFourPalacesHtml,
   generateDaiVan, generateYearly, generateLifeMapExtra —
   định nghĩa trong script.js) để không lặp lại logic, chỉ
   bọc trong khung .tuvi-pdf-page (nền trắng, chữ tối, phù
   hợp in ấn) thay vì khung tối trên giao diện web.

   Phụ thuộc: phải load SAU script.js (dùng chung các hàm
   buildMenhProfileHtml/buildFourPalacesHtml/generateDaiVan/
   generateYearly/generateLifeMapExtra/TUVI_STAR_CONTENT).
   ============================================= */

function buildTuviPdfHeader(r, plan) {
  const lunarStr = `${r.lunar.day}/${r.lunar.month}${r.lunar.leap ? ' (nhuận)' : ''}/${r.lunar.year}`;
  return `
    <div class="pdf-header">
      <div class="pdf-logo">☯ THIÊN CƠ AI</div>
      <h1>Báo Cáo Tử Vi Chi Tiết</h1>
      <p>${r.name} · ${r.gender} · Sinh ${r.dateFormatted} (Âm lịch ${lunarStr}) · ${r.birthplace}</p>
      <p class="pdf-plan-badge">📄 ${plan} — Báo cáo đầy đủ</p>
    </div>`;
}

function buildTuviPdfSummary(r) {
  return `
    <div class="pdf-numbers">
      <div class="pdf-num-cell"><div class="pdf-num-label">Bản Mệnh</div><div class="pdf-num-val">${r.menh}</div></div>
      <div class="pdf-num-cell"><div class="pdf-num-label">Cục</div><div class="pdf-num-val">${r.cuc.tenCuc}</div></div>
      <div class="pdf-num-cell"><div class="pdf-num-label">Cung Mệnh</div><div class="pdf-num-val">${r.chiMenh}</div></div>
      <div class="pdf-num-cell"><div class="pdf-num-label">Sao Thủ Mệnh</div><div class="pdf-num-val">${r.sao}</div></div>
      <div class="pdf-num-cell"><div class="pdf-num-label">Năm Sinh</div><div class="pdf-num-val">${r.canChi}</div></div>
      <div class="pdf-num-cell"><div class="pdf-num-label">Nạp Âm</div><div class="pdf-num-val">${r.napAm}</div></div>
    </div>`;
}

// Lá số 12 cung ở đầu báo cáo PDF — tái dùng đúng buildLaSoChartHtml() đã có
// (cùng dữ liệu, cùng công thức An Sao đã kiểm chứng như bản trên web),
// chỉ bọc trong khung nền trắng phù hợp in ấn (CSS .tuvi-pdf-page .laso-*).
function buildLaSoChartPrintHtml(r) {
  return `
    <h3 class="pdf-section-title">🔮 Lá Số Tử Vi Chi Tiết</h3>
    <div class="laso-grid">${buildLaSoChartHtml(r)}</div>
    ${buildLasoLegendHtml()}
    ${buildNguHanhChartHtml(r)}`;
}

// Bản PDF đầy đủ cho 3 gói tử vi trả phí — nội dung theo đúng cấp độ mỗi gói
// (giống hệt logic hiển thị trên trang trong renderPremiumReport()).
function buildTuviPremiumPrintHtml(r, plan) {
  const daiVanList = generateDaiVan(r).list;
  const daiVanHtml = daiVanList.map(d => `
    <div class="result-block"><div class="result-block-title">${d.ageRange} — ${d.title}</div><p>${d.text}</p></div>
  `).join('');

  let yearlyHtml = '';
  if (plan !== 'Luận giải toàn bộ') {
    yearlyHtml = `
      <h3 class="pdf-section-title">📅 Vận Hạn 10 Năm Tới</h3>
      ${generateYearly(r).map(y => `<div class="result-block"><div class="result-block-title">Năm ${y.year} (${y.age} tuổi)</div><p>${y.text}</p></div>`).join('')}`;
  }

  let lifeMapHtml = '';
  if (plan === 'Toàn thư vận mệnh') {
    const extra = generateLifeMapExtra(r);
    lifeMapHtml = `
      <h3 class="pdf-section-title">🗺️ Bản Đồ Cuộc Đời</h3>
      <div class="result-block"><div class="result-block-title">💞 Tình Duyên Theo Giai Đoạn</div><p>${extra.loveStages}</p></div>
      <div class="result-block"><div class="result-block-title">🧭 Lời Khuyên Tổng Kết</div><p>${extra.advice}</p></div>`;
  }

  return `
    <div class="pdf-page tuvi-pdf-page">
      ${buildTuviPdfHeader(r, plan)}
      ${buildTuviPdfSummary(r)}
      ${buildLaSoChartPrintHtml(r)}
      <h3 class="pdf-section-title">🌟 Chân Dung Mệnh Chủ</h3>
      ${buildMenhProfileHtml(r)}
      <h3 class="pdf-section-title">🎯 4 Cung Trọng Yếu</h3>
      ${buildFourPalacesHtml(r)}
      <h3 class="pdf-section-title">🌀 10 Đại Vận — ${r.cuc.tenCuc}</h3>
      ${buildDaiVanTimelineHtml(daiVanList, r.birthdate)}
      ${daiVanHtml}
      ${yearlyHtml}
      ${lifeMapHtml}
      <p class="pdf-footer">Báo cáo được tạo tự động bởi Thiên Cơ AI · Mang tính chất tham khảo, không thay thế tư vấn chuyên gia.</p>
    </div>`;
}

function printTuviPdf(html) {
  let root = document.getElementById('pdfPrintRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'pdfPrintRoot';
    document.body.appendChild(root);
  }
  root.innerHTML = html;
  window.print();
}

function downloadTuviPremiumPdf(plan) {
  if (!lastTuviResult) {
    alert('Vui lòng lập lá số miễn phí ở mục trên trước khi tải báo cáo PDF.');
    return;
  }
  printTuviPdf(buildTuviPremiumPrintHtml(lastTuviResult, plan));
}
