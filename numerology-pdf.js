/* =============================================
   XUẤT PDF BÁO CÁO THẦN SỐ HỌC
   Dùng cơ chế in của trình duyệt (window.print + CSS
   @media print) — không cần thư viện ngoài, hoạt động
   offline, cho ra file PDF thật khi chọn "Lưu dưới dạng PDF".

   Tách riêng khỏi script.js để dùng chung được ở cả trang chủ
   (index.html) lẫn trang tra cứu đơn hàng (tra-cuu-don-hang.html)
   — file này chỉ phụ thuộc numerology-engine.js, không đụng tới
   DOM ngoài #pdfPrintRoot nên an toàn include ở bất kỳ trang nào.
   ============================================= */

// Các phần dùng chung cho cả bản PDF miễn phí và bản PDF trả phí:
// bảng 7 chỉ số, Thái Độ/Trưởng Thành/Ngày Sinh, 60 Năm Cuộc Đời,
// 4 Đỉnh Cao, 4 Thử Thách, Nợ Nghiệp, footer.
function buildNumerologySharedSections(r) {
  const attitudeMeaning = NUMEROLOGY_MEANINGS[r.attitude] || NUMEROLOGY_MEANINGS[1];
  const maturityMeaning = NUMEROLOGY_MEANINGS[r.maturity] || NUMEROLOGY_MEANINGS[1];
  const birthdayMeaning = NUMEROLOGY_MEANINGS[r.birthdayNumber] || NUMEROLOGY_MEANINGS[1];
  const challengeLabels = ['Thử Thách 1 (Thời trẻ)', 'Thử Thách 2 (Trưởng thành)', 'Thử Thách 3 (Trung niên)', 'Thử Thách 4 (Hậu vận)'];

  const numberRows = [
    ['Số Chủ Đạo', r.lifePath], ['Số Sứ Mệnh', r.expression], ['Số Linh Hồn', r.soulUrge],
    ['Số Nhân Cách', r.personality], ['Số Thái Độ', r.attitude], ['Số Trưởng Thành', r.maturity],
    ['Số Ngày Sinh', r.birthdayNumber]
  ].map(([label, val]) => `<div class="pdf-num-cell"><div class="pdf-num-label">${label}</div><div class="pdf-num-val">${val}</div></div>`).join('');

  const challengesHtml = r.challenges.map((c, i) => `
    <div class="pdf-block"><h4>${challengeLabels[i]} — Số ${c}</h4><p>${CHALLENGE_MEANINGS[c] || CHALLENGE_MEANINGS[0]}</p></div>
  `).join('');

  const karmicHtml = r.karmicDebts.length ? `
    <h3>⚠ Số Nợ Nghiệp</h3>
    ${r.karmicDebts.map(k => `<p><strong>${k.label} — Nợ Nghiệp ${k.num}:</strong> ${KARMIC_DEBT_MEANINGS[k.num]}</p>`).join('')}
  ` : '';

  const thisYear = new Date().getFullYear();
  const decadesHtml = r.sixtyYearLife.map(dec => {
    const dominantMeaning = PERSONAL_YEAR_MEANINGS[dec.dominant];
    const rowHtml = dec.years.map(y => `<td class="${y.year === thisYear ? 'pdf-cycle-current' : ''}">${y.year}<br><span style="font-size:0.7rem">${y.age}t</span><br><strong>${y.py}</strong></td>`).join('');
    return `
      <div class="pdf-block">
        <h4>Thập Kỷ ${dec.decadeIndex} — ${dec.ageStart}-${dec.ageEnd} tuổi (${dec.yearStart}-${dec.yearEnd})</h4>
        <p>${dec.theme} Năng lượng chủ đạo: số <strong>${dec.dominant}</strong> — ${dominantMeaning.title}: ${dominantMeaning.desc}</p>
        <table class="pdf-cycle-table"><tr>${rowHtml}</tr></table>
      </div>`;
  }).join('');

  const pinnaclesHtml = r.pinnacles.map(p => {
    const pm = PINNACLE_MEANINGS[p.num] || PINNACLE_MEANINGS[1];
    const ageRangeText = p.ageEnd !== null
      ? `${p.ageStart}-${p.ageEnd} tuổi (${p.yearStart}-${p.yearEnd})`
      : `Từ ${p.ageStart} tuổi trở đi (từ năm ${p.yearStart})`;
    return `
      <div class="pdf-block">
        <h4>Đỉnh Cao ${p.index}: Số ${p.num} — ${pm.title}</h4>
        <p style="color:#b8891a;font-weight:600;margin-bottom:6px">${ageRangeText}</p>
        <p><strong>Nên làm gì:</strong> ${pm.doWhat}</p>
        <p><strong>Nên học gì:</strong> ${pm.learnWhat}</p>
        <p><strong>Nên sống thế nào:</strong> ${pm.howToLive}</p>
      </div>`;
  }).join('');

  return `
    <div class="pdf-numbers">${numberRows}</div>
    __OVERVIEW_PLACEHOLDER__
    <div class="pdf-block"><h3>🎭 Số Thái Độ (Ấn Tượng Đầu Tiên)</h3><p>Số Thái Độ ${r.attitude} — ${attitudeMeaning.label}. ${attitudeMeaning.overview}</p></div>
    <div class="pdf-block"><h3>🌳 Số Trưởng Thành (Giai Đoạn Sau)</h3><p>Số Trưởng Thành ${r.maturity} — ${maturityMeaning.label}. ${maturityMeaning.overview}</p></div>
    <div class="pdf-block"><h3>🎂 Số Ngày Sinh (Tài Năng Bẩm Sinh)</h3><p>Số Ngày Sinh ${r.birthdayNumber} — ${birthdayMeaning.label}. ${birthdayMeaning.overview}</p></div>
    <h3>📅 Phân Tích 60 Năm Cuộc Đời</h3>
    ${decadesHtml}
    <h3>🏔 4 Đỉnh Cao Cuộc Đời</h3>
    ${pinnaclesHtml}
    <h3>⚔ 4 Số Thử Thách Cuộc Đời</h3>
    ${challengesHtml}
    ${karmicHtml}
    <p class="pdf-footer">Báo cáo được tạo tự động bởi Thiên Cơ AI · Mang tính chất tham khảo, không thay thế tư vấn chuyên gia.</p>
  `;
}

function buildNumerologyPdfHeader(r, dateFormatted, badge) {
  return `
    <div class="pdf-header">
      <div class="pdf-logo">☯ THIÊN CƠ AI</div>
      <h1>Báo Cáo Thần Số Học</h1>
      <p>${r.name} · Sinh ngày ${dateFormatted}</p>
      ${badge ? `<p class="pdf-plan-badge">${badge}</p>` : ''}
    </div>`;
}

// Bản PDF MIỄN PHÍ — nội dung tổng quan cơ bản (giữ nguyên như trước)
function buildNumerologyPrintHtml(r) {
  const date = new Date(r.birthdate + 'T00:00:00');
  const dateFormatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  const meaning = NUMEROLOGY_MEANINGS[r.lifePath] || NUMEROLOGY_MEANINGS[1];

  const overviewHtml = `
    <div class="pdf-block"><h3>🌟 Tổng Quan Con Số Chủ Đạo</h3>
      <p>Số Chủ Đạo của ${r.name} là ${r.lifePath} — ${meaning.label}. ${meaning.overview} Số Sứ Mệnh ${r.expression} phản ánh mục tiêu bạn hướng tới trong cuộc đời, trong khi Số Linh Hồn ${r.soulUrge} tiết lộ khát khao nội tâm sâu thẳm nhất của bạn.</p></div>
    <div class="pdf-block"><h3>💼 Sự Nghiệp &amp; Con Đường Thành Công</h3><p>${meaning.career}</p></div>
    <div class="pdf-block"><h3>💗 Tình Duyên &amp; Các Mối Quan Hệ</h3><p>${meaning.love}</p></div>
    <div class="pdf-block"><h3>🎯 Bài Học Cuộc Đời</h3><p>${meaning.challenge}</p></div>`;

  const shared = buildNumerologySharedSections(r).replace('__OVERVIEW_PLACEHOLDER__', overviewHtml);
  return `<div class="pdf-page">${buildNumerologyPdfHeader(r, dateFormatted, null)}${shared}</div>`;
}

// Bản PDF TRẢ PHÍ (Gói Cá Nhân / Yêu Thương / Gia Đình) — thay phần Tổng Quan
// bằng "Chân Dung Số Chủ Đạo" đầy đủ 5 phần từ NUMEROLOGY_CONTENT_DETAILED
// (Module 2): ý nghĩa cốt lõi, điểm mạnh, điểm yếu cụ thể, checklist cải
// thiện, và gợi ý sự nghiệp/tình cảm/tài chính riêng biệt.
function buildNumerologyPremiumPrintHtml(r, plan) {
  const date = new Date(r.birthdate + 'T00:00:00');
  const dateFormatted = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  const detailed = NUMEROLOGY_CONTENT_DETAILED[r.lifePath];

  let overviewHtml;
  if (detailed) {
    overviewHtml = `
      <div class="pdf-block"><h3>🌟 Chân Dung Số Chủ Đạo ${r.lifePath} — ${detailed.label}</h3>
        ${detailed.coreMeaning.map(p => `<p>${p}</p>`).join('')}
      </div>
      <div class="pdf-block"><h3>💪 Điểm Mạnh</h3><ul>${detailed.strengths.map(s => `<li>${s}</li>`).join('')}</ul></div>
      <div class="pdf-block"><h3>⚠️ Điểm Yếu Cần Lưu Ý</h3><ul>${detailed.weaknesses.map(w => `<li>${w}</li>`).join('')}</ul></div>
      <div class="pdf-block"><h3>✅ Checklist Cải Thiện</h3><ul>${detailed.improvementChecklist.map(c => `<li>${c}</li>`).join('')}</ul></div>
      <div class="pdf-block"><h3>💼 Sự Nghiệp</h3><p>${detailed.career}</p></div>
      <div class="pdf-block"><h3>💗 Tình Duyên</h3><p>${detailed.love}</p></div>
      <div class="pdf-block"><h3>💰 Tài Chính</h3><p>${detailed.finance}</p></div>`;
  } else {
    // Dự phòng nếu số chủ đạo chưa có nội dung chi tiết (không nên xảy ra, cả 12 số đã điền)
    const meaning = NUMEROLOGY_MEANINGS[r.lifePath] || NUMEROLOGY_MEANINGS[1];
    overviewHtml = `
      <div class="pdf-block"><h3>🌟 Tổng Quan Con Số Chủ Đạo</h3><p>${meaning.overview}</p></div>
      <div class="pdf-block"><h3>💼 Sự Nghiệp</h3><p>${meaning.career}</p></div>
      <div class="pdf-block"><h3>💗 Tình Duyên</h3><p>${meaning.love}</p></div>`;
  }

  const shared = buildNumerologySharedSections(r).replace('__OVERVIEW_PLACEHOLDER__', overviewHtml);
  const badge = `📄 ${plan} — Báo cáo đầy đủ`;
  return `<div class="pdf-page">${buildNumerologyPdfHeader(r, dateFormatted, badge)}${shared}</div>`;
}

function printNumerologyPdf(html) {
  let root = document.getElementById('pdfPrintRoot');
  if (!root) {
    root = document.createElement('div');
    root.id = 'pdfPrintRoot';
    document.body.appendChild(root);
  }
  root.innerHTML = html;
  window.print();
}

function downloadNumerologyPdf() {
  if (!lastNumerologyResult) {
    alert('Vui lòng tính thần số học miễn phí ở mục trên trước khi tải báo cáo PDF.');
    return;
  }
  printNumerologyPdf(buildNumerologyPrintHtml(lastNumerologyResult));
}

// Bản PDF đầy đủ dành cho khách đã mua gói (Gói Cá Nhân / Yêu Thương / Gia Đình)
function downloadNumerologyPremiumPdf(plan) {
  if (!lastNumerologyResult) {
    alert('Vui lòng tính thần số học miễn phí ở mục trên trước khi tải báo cáo PDF.');
    return;
  }
  printNumerologyPdf(buildNumerologyPremiumPrintHtml(lastNumerologyResult, plan));
}

window.addEventListener('afterprint', () => {
  const root = document.getElementById('pdfPrintRoot');
  if (root) root.innerHTML = '';
});
