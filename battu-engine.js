/* =============================================
   BÁT TỰ (TỨ TRỤ) — góc nhìn bổ sung từ cùng ngày/giờ sinh
   Vệ tinh phụ thuộc script.js (giống tuvi-content.js/tuvi-pdf.js):
   dùng lại CAN, CHI, canChiNam/Thang/Ngay/Gio, sunLongitudeRad đã
   có sẵn — KHÔNG tính lại lịch âm từ đầu, KHÔNG có module.exports
   (chỉ chạy trong trình duyệt, kiểm bằng Puppeteer như tử vi).
   ============================================= */

// CHI_NGU_HANH (Chi -> hành) đã có sẵn trong script.js (dùng chung cho luận Miếu/Vượng/Hãm) —
// chỉ cần thêm bảng Can -> hành ở đây.
const CAN_NGU_HANH = {
  Giáp: 'Mộc', Ất: 'Mộc', Bính: 'Hỏa', Đinh: 'Hỏa', Mậu: 'Thổ',
  Kỷ: 'Thổ', Canh: 'Kim', Tân: 'Kim', Nhâm: 'Thủy', Quý: 'Thủy'
};
// Hành nào sinh ra hành nào (mẹ của mỗi hành) — dùng để xét "trợ" cho Nhật Chủ.
const HANH_SINH_RA = { Mộc: 'Thủy', Hỏa: 'Mộc', Thổ: 'Hỏa', Kim: 'Thổ', Thủy: 'Kim' };

// Ranh giới tháng Bát Tự tính theo TIẾT (kinh độ mặt trời, không dùng tháng âm lịch
// vì 2 mốc này lệch nhau tới 2 tuần trong 1 tháng) — mốc 315° = Lập Xuân = đầu tháng Dần.
function thangTietKhiIdx(jd, tz) {
  const lonDeg = sunLongitudeRad(jd - 0.5 - tz / 24) * 180 / Math.PI;
  return Math.floor(((lonDeg - 315 + 360) % 360) / 30); // 0 = Dần .. 11 = Sửu
}

function pillarLabel(canIdx, chiIdx) {
  return { can: CAN[canIdx], chi: CHI[chiIdx], text: `${CAN[canIdx]} ${CHI[chiIdx]}` };
}

// r: kết quả trả về từ computeTuvi(...) — tái dùng canNamIdx/ngayCC/gioChiIdx/lunar.jd
// đã có sẵn, đảm bảo không bao giờ lệch với Can Chi Năm hiển thị ở kết quả miễn phí.
function computeBatTu(r) {
  const tz = 7;
  // Chi năm không được trả trực tiếp trong r — tính lại riêng phần Chi năm từ canChiNam
  // (rẻ, không phụ thuộc lịch âm phức tạp) để không phải sửa thêm chữ ký computeTuvi.
  const { chiIdx: chiNamIdx } = canChiNam(r.lunar.year);

  const thangIdx0 = thangTietKhiIdx(r.lunar.jd, tz); // 0 = Dần
  const thangCC = canChiThang(r.canNamIdx, thangIdx0 + 1);

  const namP = pillarLabel(r.canNamIdx, chiNamIdx);
  const thangP = pillarLabel(thangCC.canIdx, thangCC.chiIdx);
  const ngayP = pillarLabel(r.ngayCC.canIdx, r.ngayCC.chiIdx);
  const gioCC = canChiGio(r.ngayCC.canIdx, r.gioChiIdx);
  const gioP = pillarLabel(gioCC.canIdx, gioCC.chiIdx);

  const pillars = [
    { nhan: 'Năm', ...namP }, { nhan: 'Tháng', ...thangP },
    { nhan: 'Ngày', ...ngayP }, { nhan: 'Giờ', ...gioP }
  ];

  // Đếm Ngũ Hành trên 8 ký tự (4 Can + 4 Chi) — KHÔNG tính tàng can trong Chi (phạm vi MVP).
  const counts = { Kim: 0, Mộc: 0, Thủy: 0, Hỏa: 0, Thổ: 0 };
  pillars.forEach(p => { counts[CAN_NGU_HANH[p.can]]++; counts[CHI_NGU_HANH[p.chi]]++; });

  const nhatChuCan = ngayP.can;
  const nhatChuHanh = CAN_NGU_HANH[nhatChuCan];
  const nhatChu = `${nhatChuCan} ${nhatChuHanh}`;
  const meHanh = HANH_SINH_RA[nhatChuHanh];

  // Xu hướng cân bằng: đếm hành "trợ" (cùng hành/mẹ của hành Nhật Chủ) so với phần còn lại
  // trong 7 ký tự khác (không tính lại Can ngày), nhân đôi trọng số Chi tháng vì nguyệt lệnh
  // ảnh hưởng mạnh nhất — đây là ước tính đơn giản, KHÔNG thay thế luận giải vượng suy theo mùa.
  let tro = 0, khac = 0;
  const otherChars = [
    { hanh: CAN_NGU_HANH[namP.can], w: 1 }, { hanh: CHI_NGU_HANH[namP.chi], w: 1 },
    { hanh: CAN_NGU_HANH[thangP.can], w: 1 }, { hanh: CHI_NGU_HANH[thangP.chi], w: 2 },
    { hanh: CHI_NGU_HANH[ngayP.chi], w: 1 },
    { hanh: CAN_NGU_HANH[gioP.can], w: 1 }, { hanh: CHI_NGU_HANH[gioP.chi], w: 1 }
  ];
  otherChars.forEach(({ hanh, w }) => {
    if (hanh === nhatChuHanh || hanh === meHanh) tro += w; else khac += w;
  });
  const canBang = tro >= khac ? 'nghiêng về hỗ trợ' : 'nghiêng về tiêu hao/khắc chế';

  return { pillars, counts, nhatChu, nhatChuHanh, canBang };
}

function buildBatTuHtml(r) {
  const bt = computeBatTu(r);
  const pillarsHtml = bt.pillars.map(p => `
    <div class="battu-pillar-card">
      <div class="battu-pillar-nhan">${p.nhan}</div>
      <div class="battu-pillar-can">${p.can}</div>
      <div class="battu-pillar-chi">${p.chi}</div>
    </div>`).join('');

  const content = BATTU_DAYMASTER_CONTENT[bt.nhatChu];
  const contentHtml = content ? `
    <div class="result-block">
      <div class="result-block-title">${content.label} — Nhật Chủ ${bt.nhatChu}</div>
      ${content.coreMeaning.map(p => `<p>${p}</p>`).join('')}
      <p><strong>Sự nghiệp:</strong> ${content.career}</p>
      <p><strong>Tình duyên:</strong> ${content.love}</p>
      <p><strong>Tài lộc:</strong> ${content.wealth}</p>
    </div>` : '';

  return `
    <div class="result-block">
      <div class="result-block-title">🎴 Bát Tự (Tứ Trụ) — Góc Nhìn Bổ Sung Từ Cùng Ngày Sinh</div>
      <p class="battu-disclaimer">Tính theo đúng ngày/giờ sinh bạn đã nhập, dùng tháng theo tiết khí (không phải tháng âm lịch) để đúng chuẩn Bát Tự. Đây là góc nhìn bổ sung mang tính tham khảo, không thay thế luận giải chuyên sâu.</p>
      <div class="battu-pillars">${pillarsHtml}</div>
      ${buildNguHanhChartHtmlFromCounts(bt.counts, 'Ngũ Hành Bát Tự', `Đếm trên 8 ký tự Can Chi của Tứ Trụ. Nhật Chủ ${bt.nhatChu} hiện đang <strong>${bt.canBang}</strong> — xu hướng cân bằng, không phải phán quyết Thân Vượng/Nhược chuyên sâu (chưa tính tàng can và vượng suy theo mùa).`)}
    </div>
    ${contentHtml}`;
}

// 10 Nhật Chủ (Can ngày × hành) — schema giống TUVI_STAR_CONTENT.
const BATTU_DAYMASTER_CONTENT = {
  'Giáp Mộc': {
    label: 'Cây Lớn — Rường Cột',
    coreMeaning: [
      'Giáp Mộc ví như cây cổ thụ, thẳng và vươn cao — người mang Nhật Chủ này thường có chí hướng rõ ràng, thích dẫn đầu và không ngại đứng ra chịu trách nhiệm.',
      'Tính cách thẳng thắn, nguyên tắc, đôi khi cứng nhắc vì không dễ uốn theo hoàn cảnh như các Mộc mềm dẻo khác.'
    ],
    strengths: ['Ý chí kiên định, khó bị lay chuyển', 'Có tố chất lãnh đạo, dám nhận trách nhiệm', 'Sống có nguyên tắc, đáng tin cậy'],
    weaknesses: ['Cứng nhắc, khó thỏa hiệp khi đã quyết', 'Đôi khi bảo thủ, chậm thích nghi với thay đổi đột ngột'],
    career: 'Hợp vai trò quản lý, khởi nghiệp hoặc các ngành cần tính bền vững như xây dựng, giáo dục, quản trị.',
    love: 'Chân thành, sống có trách nhiệm với người mình chọn nhưng cần học cách mềm mỏng hơn để tránh áp đặt.',
    wealth: 'Tài lộc đến từ tích lũy bền vững hơn là may mắn nhất thời, phù hợp đầu tư dài hạn thay vì lướt sóng.'
  },
  'Ất Mộc': {
    label: 'Cây Leo — Hoa Cỏ Mềm Dẻo',
    coreMeaning: [
      'Ất Mộc như dây leo, hoa cỏ — mềm dẻo, linh hoạt, biết uốn mình theo hoàn cảnh để tồn tại và phát triển.',
      'Tinh tế, khéo léo trong giao tiếp, thường được lòng người nhờ sự nhẫn nại và biết quan sát.'
    ],
    strengths: ['Thích nghi tốt với thay đổi', 'Khéo léo, tinh tế trong ứng xử', 'Kiên nhẫn, bền bỉ theo thời gian'],
    weaknesses: ['Dễ phụ thuộc vào chỗ dựa bên ngoài', 'Thiếu quyết đoán khi cần đứng mũi chịu sào'],
    career: 'Hợp các ngành cần sự khéo léo, sáng tạo và kết nối con người: truyền thông, tư vấn, nghệ thuật, chăm sóc khách hàng.',
    love: 'Tình cảm nhẹ nhàng, biết lắng nghe, nhưng cần rèn thêm sự chủ động thay vì chỉ chờ đợi.',
    wealth: 'Tài lộc thường đến qua các mối quan hệ và cơ hội bất ngờ hơn là con đường thẳng, ổn định.'
  },
  'Bính Hỏa': {
    label: 'Mặt Trời — Rực Rỡ',
    coreMeaning: [
      'Bính Hỏa như ánh mặt trời, tỏa sáng và ấm áp khắp nơi — người mang Nhật Chủ này thường nhiệt tình, hào phóng, dễ trở thành trung tâm chú ý.',
      'Cảm xúc mạnh mẽ, sống thẳng thắn, ghét sự giả tạo vòng vo.'
    ],
    strengths: ['Nhiệt huyết, truyền cảm hứng cho người xung quanh', 'Hào phóng, sống rộng lượng', 'Quyết đoán, dám thể hiện bản thân'],
    weaknesses: ['Nóng vội, dễ bộc phát cảm xúc', 'Đôi khi phô trương quá mức cần thiết'],
    career: 'Hợp các vai trò cần sự nổi bật: kinh doanh, truyền thông, giải trí, giảng dạy, đối ngoại.',
    love: 'Nồng nhiệt, chủ động trong tình cảm, nhưng cần tiết chế để không lấn át đối phương.',
    wealth: 'Kiếm tiền nhanh nhưng cũng dễ tiêu nhanh — nên có kế hoạch tiết kiệm rõ ràng thay vì chi tiêu theo cảm hứng.'
  },
  'Đinh Hỏa': {
    label: 'Ánh Nến — Ấm Áp Tinh Tế',
    coreMeaning: [
      'Đinh Hỏa như ngọn nến hay ánh đèn — không rực rỡ ồn ào như Bính Hỏa nhưng bền bỉ, ấm áp và tinh tế hơn.',
      'Nội tâm sâu sắc, giàu cảm xúc, thường quan tâm đến chi tiết và cảm nhận của người khác.'
    ],
    strengths: ['Tinh tế, giàu cảm xúc và sự thấu cảm', 'Kiên trì âm thầm, bền bỉ theo đuổi mục tiêu', 'Sáng tạo, có gu thẩm mỹ'],
    weaknesses: ['Dễ suy nghĩ nhiều, lo lắng nội tâm', 'Ngại thể hiện trực diện, đôi khi bỏ lỡ cơ hội vì rụt rè'],
    career: 'Hợp các ngành cần sự tinh tế và chiều sâu: nghệ thuật, thiết kế, viết lách, tư vấn tâm lý, y tế chăm sóc.',
    love: 'Sâu sắc, chung thủy, nhưng cần học cách bày tỏ cảm xúc rõ ràng hơn thay vì giữ trong lòng.',
    wealth: 'Tài lộc ổn định nhờ sự cẩn trọng, phù hợp tích lũy dần qua thời gian hơn là mạo hiểm lớn.'
  },
  'Mậu Thổ': {
    label: 'Núi Đồi — Vững Chãi',
    coreMeaning: [
      'Mậu Thổ như núi đồi cao lớn — vững chãi, đáng tin cậy, là điểm tựa cho những người xung quanh.',
      'Điềm tĩnh, ít khi dao động trước biến cố, nhưng cũng có phần chậm thay đổi.'
    ],
    strengths: ['Đáng tin cậy, là chỗ dựa cho người khác', 'Điềm tĩnh, kiên định trước khó khăn', 'Có trách nhiệm cao với gia đình và tập thể'],
    weaknesses: ['Chậm thích nghi với cái mới', 'Đôi khi cố chấp, khó thay đổi quan điểm đã định'],
    career: 'Hợp các ngành cần sự ổn định lâu dài: bất động sản, quản lý, hành chính, nông nghiệp, xây dựng.',
    love: 'Chung thủy, đáng tin cậy, nhưng cần chủ động thể hiện tình cảm nhiều hơn để đối phương không cảm thấy xa cách.',
    wealth: 'Tài lộc đến từ tích lũy tài sản hữu hình (đất đai, nhà cửa) hơn là các kênh biến động nhanh.'
  },
  'Kỷ Thổ': {
    label: 'Đất Ruộng — Bao Dung Nuôi Dưỡng',
    coreMeaning: [
      'Kỷ Thổ như đất ruộng màu mỡ — mềm mại, bao dung, âm thầm nuôi dưỡng vạn vật mà không phô trương.',
      'Chu đáo, tỉ mỉ, quan tâm đến người khác một cách thực tế thay vì lời nói suông.'
    ],
    strengths: ['Chu đáo, tỉ mỉ trong công việc và đời sống', 'Bao dung, biết lắng nghe và thấu hiểu', 'Thực tế, biết cách vun đắp lâu dài'],
    weaknesses: ['Dễ quên chăm sóc bản thân vì lo cho người khác', 'Thiếu quyết đoán khi cần dứt khoát'],
    career: 'Hợp các ngành chăm sóc, hỗ trợ, hậu cần: giáo dục, y tế, nhân sự, dịch vụ, nông nghiệp.',
    love: 'Ấm áp, chăm lo chu đáo cho người yêu, nhưng cần được nhắc nhở để không quên nhu cầu của chính mình.',
    wealth: 'Tài lộc đến từ sự cần cù, tích lũy đều đặn — không hợp các quyết định tài chính mạo hiểm nhanh.'
  },
  'Canh Kim': {
    label: 'Kim Loại Thô — Cứng Rắn Quyết Đoán',
    coreMeaning: [
      'Canh Kim như quặng kim loại thô, sắt thép chưa tôi luyện — cứng rắn, mạnh mẽ, thẳng thắn đến mức đôi khi va chạm.',
      'Có chí lớn, thích thử thách, không ngại đối đầu khó khăn.'
    ],
    strengths: ['Quyết đoán, dám nghĩ dám làm', 'Mạnh mẽ, kiên cường trước áp lực', 'Thẳng thắn, không giả tạo'],
    weaknesses: ['Dễ va chạm vì thiếu mềm mỏng', 'Cứng đầu, khó nhận sai khi tranh luận'],
    career: 'Hợp các ngành cần sự quyết liệt và kỷ luật: quân đội, thể thao, kỹ thuật, luật, kinh doanh cạnh tranh cao.',
    love: 'Bảo vệ mạnh mẽ cho người mình yêu, nhưng cần rèn sự tinh tế để tránh lời nói làm tổn thương đối phương.',
    wealth: 'Tài lộc đến từ nỗ lực và cạnh tranh trực tiếp — phù hợp các lĩnh vực cần bứt phá hơn là an toàn.'
  },
  'Tân Kim': {
    label: 'Trang Sức — Tinh Xảo Sắc Sảo',
    coreMeaning: [
      'Tân Kim như trang sức, kim loại đã qua tôi luyện — tinh xảo, sắc sảo, coi trọng vẻ ngoài và sự hoàn thiện.',
      'Nhạy cảm, để ý tiểu tiết, có gu thẩm mỹ và tiêu chuẩn cao cho bản thân.'
    ],
    strengths: ['Tinh tế, có gu thẩm mỹ và sự tỉ mỉ cao', 'Nhạy bén, tư duy sắc sảo', 'Coi trọng chất lượng và sự hoàn thiện'],
    weaknesses: ['Dễ khó chịu khi mọi thứ không như ý', 'Nhạy cảm quá mức với lời phê bình'],
    career: 'Hợp các ngành cần sự chỉn chu, thẩm mỹ: thiết kế, tài chính, luật, phân tích dữ liệu, ngành hàng cao cấp.',
    love: 'Yêu cầu cao với bạn đời nhưng cũng rất chăm chút cho mối quan hệ nếu tìm được người phù hợp.',
    wealth: 'Tài lộc ổn định nhờ tính toán cẩn thận, phù hợp các kênh đầu tư có phân tích kỹ hơn là may rủi.'
  },
  'Nhâm Thủy': {
    label: 'Biển Cả — Phóng Khoáng Biến Hóa',
    coreMeaning: [
      'Nhâm Thủy như biển cả mênh mông — phóng khoáng, thông minh, tư duy linh hoạt và luôn tìm cách thích nghi.',
      'Thích tự do, không thích bị gò bó trong khuôn khổ cứng nhắc.'
    ],
    strengths: ['Tư duy linh hoạt, thích nghi nhanh', 'Phóng khoáng, quảng giao, dễ kết nối', 'Thông minh, nhìn xa trông rộng'],
    weaknesses: ['Thiếu kiên định, dễ đổi hướng giữa chừng', 'Đôi khi thiếu kỷ luật với bản thân'],
    career: 'Hợp các ngành cần tư duy chiến lược, kết nối rộng: kinh doanh quốc tế, truyền thông, công nghệ, ngoại giao.',
    love: 'Phóng khoáng, hấp dẫn, nhưng cần rèn sự kiên định để mối quan hệ đi được đường dài.',
    wealth: 'Tài lộc đa dạng, nhiều nguồn, nhưng cần kỷ luật quản lý để tránh phân tán quá mức.'
  },
  'Quý Thủy': {
    label: 'Mưa Sương — Nhẹ Nhàng Tinh Tế',
    coreMeaning: [
      'Quý Thủy như mưa nhỏ hay sương mai — nhẹ nhàng, âm thầm nhưng thấm sâu, nuôi dưỡng mọi thứ xung quanh.',
      'Nhạy cảm, giàu trực giác, thường thấu hiểu người khác mà không cần nói nhiều.'
    ],
    strengths: ['Nhạy cảm, giàu trực giác và sự thấu hiểu', 'Kiên nhẫn, bền bỉ theo cách âm thầm', 'Tinh tế trong cảm nhận và ứng xử'],
    weaknesses: ['Dễ đa cảm, suy nghĩ quá nhiều', 'Thiếu quyết đoán, ngại đối đầu trực diện'],
    career: 'Hợp các ngành cần sự thấu cảm và tinh tế: tư vấn, tâm lý, chăm sóc sức khỏe, nghệ thuật, nghiên cứu.',
    love: 'Sâu lắng, chân thành, nhưng cần học cách bày tỏ rõ ràng hơn để tránh hiểu lầm.',
    wealth: 'Tài lộc đến từ sự bền bỉ, tích lũy nhỏ nhưng đều — không hợp các quyết định tài chính vội vàng.'
  }
};
