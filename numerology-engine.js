/* =============================================
   NUMEROLOGY ENGINE — Thiên Cơ AI
   Module tính toán thuần (KHÔNG phụ thuộc DOM/trình duyệt).
   Chạy được cả trong browser (load qua <script>, expose biến
   global) lẫn trong Node.js (dùng require() để viết unit test).

   Hệ thống: Pythagoras (chuẩn phổ biến quốc tế + Việt Nam).
   Mỗi chỉ số ghi rõ nguồn công thức trong comment để tiện
   đối chiếu/kiểm tra lại độ chính xác.
   ============================================= */

// ===== Bảng chữ cái -> số (hệ Pythagoras) =====
// Quy tắc chuẩn hóa: bỏ dấu tiếng Việt trước khi tính (dùng Unicode NFD +
// xử lý riêng "đ/Đ" vì ký tự này không tách dấu qua NFD).
const LETTER_VALUES = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9
};
const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

function stripDiacritics(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function nameToLetters(name) {
  return stripDiacritics(name).toLowerCase().replace(/[^a-z]/g, '').split('');
}

function sumLetterValues(letters) {
  return letters.reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
}

// ===== Hàm rút gọn số =====
function digitsSum(n) {
  return String(n).split('').reduce((sum, d) => sum + Number(d), 0);
}

// Rút gọn về 1 chữ số, GIỮ NGUYÊN số Master (11, 22, 33) — dùng cho hầu hết
// các chỉ số chính (Số Chủ Đạo, Sứ Mệnh, Linh Hồn, Nhân Cách, Ngày Sinh...).
function reduceNumber(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = digitsSum(n);
  return n;
}

// Rút gọn về ĐÚNG 1 chữ số, KHÔNG giữ số Master — dùng cho Số Thử Thách,
// Năm Cá Nhân và 3 "số chân đế" của Kim Tự Tháp Đỉnh Cao.
function reduceToSingle(n) {
  while (n > 9) n = digitsSum(n);
  return n;
}

// ===== Số Nợ Nghiệp (Karmic Debt) =====
// Nếu 13/14/16/19 xuất hiện ở BẤT KỲ bước rút gọn trung gian nào (kể cả
// tổng thô ban đầu) trên đường rút gọn về số cuối cùng, đây là Số Nợ Nghiệp.
const KARMIC_DEBT_NUMS = [13, 14, 16, 19];
function reduceWithKarmic(n) {
  const path = [n];
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = digitsSum(n);
    path.push(n);
  }
  const karmic = path.find(v => KARMIC_DEBT_NUMS.includes(v));
  return { value: n, karmic: karmic || null };
}

const KARMIC_DEBT_MEANINGS = {
  13: 'Bài học về sự lười biếng và trốn tránh trách nhiệm — kiếp này cần chăm chỉ, kỷ luật để đạt thành quả xứng đáng, không có đường tắt.',
  14: 'Bài học về việc lạm dụng tự do quá mức — cần học cách kiểm soát bản thân, tránh buông thả trong dục vọng và thói quen.',
  16: 'Bài học về cái tôi và kiêu ngạo — thường trải qua những đổ vỡ bất ngờ (tình cảm, sự nghiệp) để học sự khiêm nhường và buông bỏ.',
  19: 'Bài học về sự ích kỷ và độc đoán ở kiếp trước — kiếp này cần học cách tự lực nhưng vẫn biết quan tâm, lắng nghe người khác.'
};

// ===== Nội dung luận giải theo từng con số (1-9, 11, 22, 33) =====
// Dùng chung cho Số Chủ Đạo / Số Sứ Mệnh / Số Linh Hồn / Số Nhân Cách /
// Số Thái Độ / Số Trưởng Thành / Số Ngày Sinh (mỗi chỉ số tham chiếu tới
// đúng ý nghĩa gốc của con số, không phân biệt "loại chỉ số nào ra số đó").
const NUMEROLOGY_MEANINGS = {
  1: {
    label: 'Người Lãnh Đạo',
    overview: 'Bạn mang năng lượng của người tiên phong, độc lập, giàu ý chí và luôn muốn dẫn đầu.',
    career: 'Phù hợp với vai trò lãnh đạo, khởi nghiệp hoặc tự làm chủ; thành công đến từ sự quyết đoán và dám khác biệt.',
    love: 'Trong tình cảm cần học cách lắng nghe và chia sẻ quyền quyết định thay vì luôn muốn kiểm soát.',
    challenge: 'Bài học lớn nhất là cân bằng giữa cái tôi và sự hợp tác với người khác.'
  },
  2: {
    label: 'Người Hòa Giải',
    overview: 'Bạn nhạy cảm, tinh tế và có khả năng kết nối, dung hòa mọi mâu thuẫn xung quanh.',
    career: 'Phù hợp làm việc nhóm, tư vấn, ngoại giao hoặc các vai trò hỗ trợ, kết nối con người.',
    love: 'Là người bạn đời chu đáo, luôn đặt sự hòa hợp lên hàng đầu, nhưng dễ quên nhu cầu bản thân.',
    challenge: 'Cần học cách nói ra chính kiến thay vì luôn nhường nhịn để tránh xung đột.'
  },
  3: {
    label: 'Người Sáng Tạo',
    overview: 'Bạn tràn đầy năng lượng biểu đạt, hài hước, có năng khiếu nghệ thuật và giao tiếp.',
    career: 'Tỏa sáng trong lĩnh vực nghệ thuật, truyền thông, giải trí, viết lách hoặc bất kỳ công việc cần sự sáng tạo.',
    love: 'Vui vẻ, lãng mạn, mang lại tiếng cười cho mối quan hệ nhưng cần rèn sự kiên định lâu dài.',
    challenge: 'Dễ phân tán năng lượng vào nhiều việc cùng lúc, cần học cách tập trung hoàn thành đến cùng.'
  },
  4: {
    label: 'Người Xây Dựng',
    overview: 'Bạn thực tế, kỷ luật và đáng tin cậy, luôn xây dựng nền tảng vững chắc cho mọi việc.',
    career: 'Thành công trong các ngành đòi hỏi tính hệ thống như kỹ thuật, tài chính, quản lý, xây dựng.',
    love: 'Chung thủy, ổn định, là chỗ dựa an toàn nhưng đôi khi thiếu sự lãng mạn bất ngờ.',
    challenge: 'Cần học cách linh hoạt hơn và không quá cứng nhắc với kế hoạch đã đặt ra.'
  },
  5: {
    label: 'Người Tự Do',
    overview: 'Bạn năng động, ham khám phá, thích thay đổi và không ngừng tìm kiếm trải nghiệm mới.',
    career: 'Phù hợp với công việc năng động, du lịch, kinh doanh, truyền thông — nơi không bị gò bó.',
    love: 'Hấp dẫn, thú vị nhưng cần học cách cam kết và giữ sự ổn định trong mối quan hệ lâu dài.',
    challenge: 'Bài học là biết tiết chế và theo đuổi mục tiêu đến cùng thay vì đổi hướng liên tục.'
  },
  6: {
    label: 'Người Nuôi Dưỡng',
    overview: 'Bạn giàu tình thương, trách nhiệm, luôn đặt gia đình và cộng đồng lên hàng đầu.',
    career: 'Phù hợp với giáo dục, y tế, tư vấn, các công việc chăm sóc và phục vụ cộng đồng.',
    love: 'Là người bạn đời tận tụy, chu toàn, mang lại cảm giác an toàn tuyệt đối cho gia đình.',
    challenge: 'Cần tránh ôm đồm trách nhiệm của người khác và học cách chăm sóc bản thân nhiều hơn.'
  },
  7: {
    label: 'Người Tìm Kiếm Chân Lý',
    overview: 'Bạn trầm tĩnh, sâu sắc, thích phân tích và luôn đặt câu hỏi về ý nghĩa cuộc sống.',
    career: 'Tỏa sáng trong nghiên cứu, khoa học, tâm linh, công nghệ hoặc các lĩnh vực cần tư duy độc lập.',
    love: 'Cần không gian riêng và một người bạn đời thấu hiểu sự tĩnh lặng của mình.',
    challenge: 'Dễ khép mình và xa cách người khác, cần học cách mở lòng chia sẻ cảm xúc.'
  },
  8: {
    label: 'Quyền Lực & Thành Công',
    overview: 'Bạn có tầm nhìn lớn, tham vọng và bản năng quản lý tài chính, tổ chức xuất sắc.',
    career: 'Phù hợp làm kinh doanh, quản lý cấp cao, tài chính, bất động sản — nơi phát huy khả năng lãnh đạo.',
    love: 'Mạnh mẽ, bao bọc người thương nhưng cần cân bằng giữa công việc và đời sống tình cảm.',
    challenge: 'Học cách sử dụng quyền lực và tiền bạc một cách khôn ngoan, không để chúng chi phối giá trị sống.'
  },
  9: {
    label: 'Lòng Nhân Ái',
    overview: 'Bạn vị tha, giàu lòng trắc ẩn và luôn hướng đến những giá trị lớn lao hơn bản thân.',
    career: 'Phù hợp với công tác thiện nguyện, nghệ thuật, giáo dục, hoặc bất kỳ công việc mang tính cống hiến.',
    love: 'Bao dung, thấu cảm, nhưng cần học cách giữ ranh giới để không đánh mất bản thân vì người khác.',
    challenge: 'Bài học là buông bỏ những gì không còn phù hợp để mở đường cho những khởi đầu mới.'
  },
  11: {
    label: 'Bậc Thầy Trực Giác',
    overview: 'Bạn sở hữu trực giác mạnh mẽ, nhạy cảm tâm linh và khả năng truyền cảm hứng cho người khác.',
    career: 'Phù hợp với vai trò diễn giả, cố vấn tâm linh, nghệ thuật hoặc công việc cần sự thấu cảm sâu sắc.',
    love: 'Yêu sâu sắc và lý tưởng hóa, cần một người bạn đời đủ vững vàng để đồng hành cùng sự nhạy cảm của bạn.',
    challenge: 'Áp lực từ chính kỳ vọng cao của bản thân; cần học cách giữ vững tinh thần trước căng thẳng.'
  },
  22: {
    label: 'Kiến Tạo Bậc Thầy',
    overview: 'Bạn có khả năng biến những ý tưởng lớn lao thành hiện thực cụ thể, ảnh hưởng đến nhiều người.',
    career: 'Phù hợp với vai trò kiến tạo hệ thống, lãnh đạo tổ chức lớn, hoặc các dự án tầm cỡ quốc gia, quốc tế.',
    love: 'Cần một người bạn đời kiên nhẫn, thấu hiểu tham vọng lớn và sự bận rộn trong hành trình của bạn.',
    challenge: 'Áp lực hoàn hảo hóa mọi việc có thể khiến bạn quá tải; cần học cách san sẻ và tin tưởng người khác.'
  },
  33: {
    label: 'Người Thầy Bậc Thầy',
    overview: 'Bạn mang năng lượng yêu thương vô điều kiện, luôn sẵn sàng nâng đỡ và dẫn dắt người khác.',
    career: 'Tỏa sáng trong giáo dục, chữa lành, công tác xã hội — nơi bạn có thể phụng sự cộng đồng bằng cả trái tim.',
    love: 'Yêu thương sâu sắc và hy sinh nhiều cho người thân yêu, cần học cách nhận lại chứ không chỉ cho đi.',
    challenge: 'Dễ quên chăm sóc bản thân vì mải lo cho người khác; hãy học cách yêu bản thân trước tiên.'
  }
};

const CHALLENGE_MEANINGS = {
  0: 'Không có thử thách rõ rệt — con đường tương đối bằng phẳng, nhưng cần tự tạo động lực và mục tiêu cho riêng mình.',
  1: 'Học cách tự lập và tự tin đưa ra quyết định độc lập, không dựa dẫm hay sợ hãi ý kiến trái chiều từ người khác.',
  2: 'Học cách hợp tác, tiết chế sự nhạy cảm quá mức và tránh phụ thuộc cảm xúc vào người khác.',
  3: 'Vượt qua nỗi sợ bị đánh giá hoặc chê cười, học cách thể hiện bản thân và cảm xúc một cách trọn vẹn.',
  4: 'Rèn kỷ luật và sự kiên trì, vượt qua cảm giác bị giới hạn bởi hoàn cảnh hoặc khuôn khổ.',
  5: 'Kiểm soát ham muốn tự do và thay đổi quá mức, học cách cam kết và theo đuổi mục tiêu dài hạn.',
  6: 'Buông bỏ chủ nghĩa hoàn hảo, học cách chấp nhận sự không hoàn hảo ở bản thân và người xung quanh.',
  7: 'Vượt qua sự hoài nghi và xu hướng cô lập, học cách tin tưởng và mở lòng chia sẻ với người khác.',
  8: 'Cân bằng giữa vật chất và giá trị tinh thần, tránh để quyền lực hoặc tiền bạc chi phối các quyết định quan trọng.'
};

// Ý nghĩa từng Năm Cá Nhân (1-9) — nền tảng để phân tích 60 năm cuộc đời theo từng năm cụ thể
const PERSONAL_YEAR_MEANINGS = {
  1: { title: 'Khởi Đầu Mới', desc: 'Thời điểm gieo hạt cho chu kỳ 9 năm tiếp theo — thích hợp để bắt đầu dự án, công việc hoặc mối quan hệ mới.' },
  2: { title: 'Hợp Tác & Kiên Nhẫn', desc: 'Cần sự khéo léo, hợp tác và kiên nhẫn chờ đợi thành quả thay vì hành động vội vàng.' },
  3: { title: 'Sáng Tạo & Giao Tiếp', desc: 'Năng lượng xã hội và sáng tạo lên cao, thuận lợi để mở rộng quan hệ và thể hiện bản thân.' },
  4: { title: 'Xây Dựng Nền Tảng', desc: 'Giai đoạn làm việc chăm chỉ, đặt nền móng vững chắc cho tương lai, ít phô trương.' },
  5: { title: 'Thay Đổi & Tự Do', desc: 'Biến động, cơ hội mới và những chuyến đi bất ngờ — cần linh hoạt thích nghi.' },
  6: { title: 'Trách Nhiệm & Gia Đình', desc: 'Trọng tâm dồn vào gia đình, trách nhiệm và các mối quan hệ thân thiết.' },
  7: { title: 'Chiêm Nghiệm Nội Tâm', desc: 'Thời điểm lùi lại, suy ngẫm, học hỏi và phát triển đời sống tinh thần.' },
  8: { title: 'Thành Tựu & Tài Chính', desc: 'Năng lượng vật chất và quyền lực lên cao — cơ hội lớn về tài chính, sự nghiệp.' },
  9: { title: 'Hoàn Tất & Buông Bỏ', desc: 'Khép lại một chu kỳ, buông bỏ những gì không còn phù hợp để chuẩn bị khởi đầu mới.' }
};

// Ý nghĩa 4 Đỉnh Cao Cuộc Đời (Kim Tự Tháp thần số học) — nên làm gì, học gì, sống thế nào
const PINNACLE_MEANINGS = {
  1: { title: 'Đỉnh Cao Của Sự Độc Lập & Khởi Đầu',
    doWhat: 'Chủ động khởi xướng dự án, công việc hoặc con đường mới của riêng mình; đừng chờ cơ hội đến mà hãy tự tạo ra nó.',
    learnWhat: 'Học cách ra quyết định độc lập, xây dựng sự tự tin và khả năng lãnh đạo bản thân.',
    howToLive: 'Sống chủ động, dám thử và dám sai — đây là giai đoạn gieo hạt cho những thành tựu về sau.' },
  2: { title: 'Đỉnh Cao Của Hợp Tác & Cân Bằng',
    doWhat: 'Xây dựng các mối quan hệ đối tác, làm việc nhóm và tìm kiếm sự cân bằng giữa các bên liên quan.',
    learnWhat: 'Học sự kiên nhẫn, lắng nghe và nghệ thuật ngoại giao, thỏa hiệp.',
    howToLive: 'Sống hài hòa, tránh đối đầu trực diện; thành công đến từ sự hợp tác chứ không phải đơn độc.' },
  3: { title: 'Đỉnh Cao Của Sáng Tạo & Thể Hiện Bản Thân',
    doWhat: 'Theo đuổi các hoạt động sáng tạo, nghệ thuật, viết lách, giao tiếp và mở rộng các mối quan hệ xã hội.',
    learnWhat: 'Trau dồi kỹ năng biểu đạt, giao tiếp và không ngừng học hỏi kiến thức mới.',
    howToLive: 'Sống lạc quan, cởi mở, để cảm xúc và sự sáng tạo dẫn lối nhưng vẫn cần kỷ luật để không phân tán.' },
  4: { title: 'Đỉnh Cao Của Xây Dựng Nền Tảng',
    doWhat: 'Tập trung xây dựng nền tảng vững chắc: sự nghiệp ổn định, tài sản, hệ thống và quy trình làm việc.',
    learnWhat: 'Học tính kỷ luật, sự kiên trì và khả năng quản lý chi tiết, tổ chức công việc.',
    howToLive: 'Sống thực tế, chăm chỉ, không nóng vội — đây là giai đoạn "trả giá" bằng công sức để nhận thành quả bền vững sau này.' },
  5: { title: 'Đỉnh Cao Của Thay Đổi & Tự Do',
    doWhat: 'Đón nhận những thay đổi lớn: chuyển việc, chuyển nơi ở, du lịch, trải nghiệm những điều mới mẻ.',
    learnWhat: 'Học cách thích nghi nhanh, quản lý rủi ro khi thay đổi và giữ kỷ luật giữa nhiều lựa chọn tự do.',
    howToLive: 'Sống linh hoạt, không tự ràng buộc vào khuôn khổ cũ, nhưng cần tránh buông thả quá đà.' },
  6: { title: 'Đỉnh Cao Của Trách Nhiệm & Gia Đình',
    doWhat: 'Tập trung vun đắp gia đình, nuôi dạy con cái, chăm sóc người thân và xây dựng tổ ấm.',
    learnWhat: 'Học cách cân bằng giữa trách nhiệm với người khác và nhu cầu của chính mình.',
    howToLive: 'Sống vị tha, yêu thương nhưng cần đặt ra ranh giới lành mạnh để không kiệt sức vì gánh vác quá nhiều.' },
  7: { title: 'Đỉnh Cao Của Trí Tuệ & Chiều Sâu Nội Tâm',
    doWhat: 'Đầu tư vào nghiên cứu, học thuật, chuyên môn hóa sâu hoặc phát triển đời sống tâm linh.',
    learnWhat: 'Học cách phân tích sâu sắc, phát triển trực giác và sự tĩnh lặng nội tâm.',
    howToLive: 'Sống chiêm nghiệm, dành thời gian ở một mình để thấu hiểu bản thân, tránh vội vàng phán xét.' },
  8: { title: 'Đỉnh Cao Của Quyền Lực & Thành Tựu Vật Chất',
    doWhat: 'Theo đuổi các mục tiêu lớn về tài chính, kinh doanh, vị thế và quyền lực trong lĩnh vực của mình.',
    learnWhat: 'Học quản trị tài chính, tư duy chiến lược và cách sử dụng quyền lực một cách có trách nhiệm.',
    howToLive: 'Sống bản lĩnh, quyết đoán nhưng cần giữ đạo đức để thành công không đánh đổi bằng giá trị cốt lõi.' },
  9: { title: 'Đỉnh Cao Của Cống Hiến & Buông Bỏ',
    doWhat: 'Hướng đến các hoạt động cống hiến, từ thiện, giảng dạy hoặc truyền lại kinh nghiệm cho thế hệ sau.',
    learnWhat: 'Học cách buông bỏ những gì không còn phù hợp và mở rộng lòng vị tha, bao dung.',
    howToLive: 'Sống rộng lượng, nhìn xa hơn lợi ích cá nhân, chuẩn bị tâm thế khép lại một chặng đường lớn.' },
  11: { title: 'Đỉnh Cao Bậc Thầy Của Trực Giác',
    doWhat: 'Phát huy vai trò truyền cảm hứng, cố vấn tinh thần hoặc dẫn dắt người khác bằng tầm nhìn của mình.',
    learnWhat: 'Học cách kiểm soát sự nhạy cảm cao độ và biến trực giác thành hành động cụ thể.',
    howToLive: 'Sống chân thực với lý tưởng của bản thân, giữ tinh thần vững vàng trước áp lực kỳ vọng.' },
  22: { title: 'Đỉnh Cao Bậc Thầy Kiến Tạo',
    doWhat: 'Theo đuổi những dự án lớn, có tầm ảnh hưởng rộng, biến ý tưởng thành hiện thực quy mô lớn.',
    learnWhat: 'Học cách quản lý nguồn lực lớn, xây dựng đội ngũ và biến tầm nhìn thành kế hoạch khả thi.',
    howToLive: 'Sống kiên định với mục tiêu lớn nhưng biết san sẻ, không ôm đồm mọi việc một mình.' },
  33: { title: 'Đỉnh Cao Bậc Thầy Của Yêu Thương',
    doWhat: 'Cống hiến hết mình cho giáo dục, chữa lành hoặc phụng sự cộng đồng bằng cả trái tim.',
    learnWhat: 'Học cách yêu thương bản thân trước khi cho đi, tránh hy sinh quá mức.',
    howToLive: 'Sống bao dung, làm gương cho người khác bằng chính hành động và tình yêu thương vô điều kiện.' }
};

// ===== 4 Đỉnh Cao Cuộc Đời (Kim Tự Tháp) =====
// Nguồn công thức: phương pháp "Kim Tự Tháp Thần Số Học" phổ biến (đối chiếu
// nhiều nguồn tiếng Việt, xem HUONG_DAN_DEPLOY.md mục ghi chú công thức).
// 3 "số chân đế": trái = tháng rút gọn, giữa = ngày rút gọn, phải = năm rút gọn.
// Đỉnh 1 = trái+giữa, Đỉnh 2 = giữa+phải, Đỉnh 3 = Đỉnh1+Đỉnh2, Đỉnh 4 = trái+phải.
// Tuổi kết thúc Đỉnh 1 = 36 - Số Chủ Đạo; mỗi đỉnh sau kéo dài 9 năm; Đỉnh 4 tới hết đời.
function computePinnacles(mR, dR, yR, lifePath, birthYear) {
  const p1 = reduceNumber(mR + dR);
  const p2 = reduceNumber(dR + yR);
  const p3 = reduceNumber(p1 + p2);
  const p4 = reduceNumber(mR + yR);

  const p1End = 36 - lifePath;
  const p2End = p1End + 9;
  const p3End = p2End + 9;

  return [
    { index: 1, num: p1, ageStart: 0, ageEnd: p1End, yearStart: birthYear, yearEnd: birthYear + p1End },
    { index: 2, num: p2, ageStart: p1End + 1, ageEnd: p2End, yearStart: birthYear + p1End + 1, yearEnd: birthYear + p2End },
    { index: 3, num: p3, ageStart: p2End + 1, ageEnd: p3End, yearStart: birthYear + p2End + 1, yearEnd: birthYear + p3End },
    { index: 4, num: p4, ageStart: p3End + 1, ageEnd: null, yearStart: birthYear + p3End + 1, yearEnd: null }
  ];
}

// Chủ đề tổng quan từng thập kỷ (0-9, 10-19, ..., 50-59 tuổi) trong phân tích 60 năm cuộc đời
const DECADE_THEMES = [
  'Giai đoạn hình thành nền tảng nhân cách, giá trị sống và những ký ức đầu đời.',
  'Giai đoạn khám phá bản thân, học tập và định hình đam mê, ước mơ.',
  'Giai đoạn khởi nghiệp, xây dựng sự nghiệp và các mối quan hệ quan trọng của cuộc đời.',
  'Giai đoạn củng cố, phát triển chiều sâu sự nghiệp, tài chính và gia đình.',
  'Giai đoạn đỉnh cao, gặt hái thành quả và khẳng định vị thế, uy tín.',
  'Giai đoạn chiêm nghiệm, truyền lại kinh nghiệm và chuẩn bị cho hậu vận an nhiên.'
];

// Số Năm Cá Nhân (Personal Year) = rút gọn(tổng chữ số của ngày + tháng + năm dương lịch)
function personalYearOf(day, month, year) {
  return reduceToSingle(digitsSum(day) + digitsSum(month) + digitsSum(year));
}

// Số xuất hiện nhiều nhất trong 1 thập kỷ — dùng làm "năng lượng chủ đạo" của giai đoạn đó
function modeOf(nums) {
  const count = {};
  let best = nums[0], bestCount = 0;
  for (const n of nums) {
    count[n] = (count[n] || 0) + 1;
    if (count[n] > bestCount) { bestCount = count[n]; best = n; }
  }
  return best;
}

// Phân tích 60 năm cuộc đời (từ năm sinh), chia thành 6 thập kỷ, mỗi thập kỷ 10 năm cá nhân cụ thể
function computeSixtyYearLife(day, month, birthYear) {
  const decades = [];
  for (let d = 0; d < 6; d++) {
    const years = [];
    for (let i = 0; i < 10; i++) {
      const age = d * 10 + i;
      const year = birthYear + age;
      years.push({ year, age, py: personalYearOf(day, month, year) });
    }
    const dominant = modeOf(years.map(y => y.py));
    decades.push({
      decadeIndex: d + 1,
      ageStart: d * 10,
      ageEnd: d * 10 + 9,
      yearStart: years[0].year,
      yearEnd: years[9].year,
      years,
      dominant,
      theme: DECADE_THEMES[d]
    });
  }
  return decades;
}

/**
 * Hàm chính: tính toàn bộ chỉ số thần số học từ họ tên + ngày sinh dương lịch.
 * @param {string} name - Họ tên đầy đủ (có dấu tiếng Việt, sẽ tự chuẩn hóa).
 * @param {string} birthdate - Định dạng "YYYY-MM-DD".
 * @returns {object} Toàn bộ chỉ số: lifePath, expression, soulUrge, personality,
 *   birthdayNumber, attitude, maturity, challenges[4], karmicDebts[], pinnacles[4],
 *   sixtyYearLife[6 thập kỷ].
 */
function computeNumerology(name, birthdate) {
  const [yearStr, monthStr, dayStr] = birthdate.split('-');
  const year = Number(yearStr), month = Number(monthStr), day = Number(dayStr);

  // Số Chủ Đạo (Life Path Number): tổng tất cả chữ số ngày+tháng+năm sinh, rút gọn (giữ Master)
  const digits = birthdate.replace(/-/g, '').split('').map(Number);
  const totalRaw = digits.reduce((a, b) => a + b, 0);
  const { value: lifePath, karmic: lifePathKarmic } = reduceWithKarmic(totalRaw);

  const letters = nameToLetters(name);
  const vowels = letters.filter(ch => VOWELS.has(ch));
  const consonants = letters.filter(ch => !VOWELS.has(ch));

  // Số Sứ Mệnh (Expression): tổng giá trị TOÀN BỘ chữ cái trong họ tên
  const { value: expression, karmic: expressionKarmic } = reduceWithKarmic(sumLetterValues(letters));
  // Số Linh Hồn (Soul Urge): tổng giá trị các NGUYÊN ÂM trong họ tên
  const { value: soulUrge, karmic: soulUrgeKarmic } = reduceWithKarmic(sumLetterValues(vowels));
  // Số Nhân Cách (Personality): tổng giá trị các PHỤ ÂM trong họ tên
  const { value: personality, karmic: personalityKarmic } = reduceWithKarmic(sumLetterValues(consonants));

  const karmicDebts = [
    { label: 'Số Chủ Đạo', num: lifePathKarmic },
    { label: 'Số Sứ Mệnh', num: expressionKarmic },
    { label: 'Số Linh Hồn', num: soulUrgeKarmic },
    { label: 'Số Nhân Cách', num: personalityKarmic }
  ].filter(k => k.num);

  // Số Ngày Sinh (Birthday Number): chỉ riêng ngày sinh trong tháng, rút gọn (giữ Master)
  const birthdayNumber = reduceNumber(day);

  // Số Thái Độ (Attitude): ấn tượng đầu tiên bạn tạo ra, từ tháng + ngày sinh
  const attitude = reduceNumber(month + day);
  // Số Trưởng Thành (Maturity): định hướng cuộc đời giai đoạn sau (thường sau tuổi 35-40)
  const maturity = reduceNumber(lifePath + expression);

  // 4 Số Thử Thách (Challenge Numbers): rút gọn tháng/ngày/năm về đúng 1 chữ số rồi lấy hiệu tuyệt đối
  const mR = reduceToSingle(month), dR = reduceToSingle(day), yR = reduceToSingle(digitsSum(year));
  const challenge1 = Math.abs(mR - dR);
  const challenge2 = Math.abs(dR - yR);
  const challenge3 = Math.abs(challenge1 - challenge2);
  const challenge4 = Math.abs(mR - yR);
  const challenges = [challenge1, challenge2, challenge3, challenge4];

  // Phân tích 60 Năm Cuộc Đời — chia 6 thập kỷ, mỗi thập kỷ 10 năm cá nhân cụ thể
  const sixtyYearLife = computeSixtyYearLife(day, month, year);

  // 4 Đỉnh Cao Cuộc Đời (kim tự tháp), dùng chung 3 số chân đế với Thử Thách
  const pinnacles = computePinnacles(mR, dR, yR, lifePath, year);

  return {
    name, birthdate, lifePath, expression, soulUrge, personality, birthdayNumber,
    attitude, maturity, challenges, karmicDebts, sixtyYearLife, pinnacles
  };
}

/* =============================================
   MODULE 2 — SCHEMA NỘI DUNG CHI TIẾT (bản nháp, CHƯA gắn vào giao diện)
   =============================================
   Đây là bản demo cấu trúc dữ liệu theo đúng 5 phần yêu cầu:
     1. coreMeaning        — Ý nghĩa cốt lõi (2-3 đoạn)
     2. strengths[]        — Điểm mạnh
     3. weaknesses[]        — Điểm yếu/thách thức CỤ THỂ (không chung chung)
     4. improvementChecklist[] — Checklist hành động cụ thể để cải thiện
     5. career / love / finance — Gợi ý riêng theo 3 lĩnh vực

   Đã viết đầy đủ cả 12 số (1-9, 11, 22, 33) theo đúng khuôn mẫu đã duyệt
   (3 số mẫu ban đầu: 1, 4, 7 → duyệt văn phong OK → viết tiếp 9 số còn lại).

   Đã gắn vào file PDF của các gói TRẢ PHÍ (Gói Cá Nhân / Yêu Thương / Gia
   Đình) — xem buildNumerologyPremiumPrintHtml() trong script.js. Bản MIỄN
   PHÍ (buildNumerologyPrintHtml, renderNumerologyResult) vẫn dùng
   NUMEROLOGY_MEANINGS (bản cũ) như trước, không đổi.
   ============================================= */
const NUMEROLOGY_CONTENT_DETAILED = {
  1: {
    label: 'Người Lãnh Đạo',
    coreMeaning: [
      'Số 1 là con số của sự khởi đầu, độc lập và tinh thần tiên phong. Đây là năng lượng của người luôn muốn đi đầu, tự tạo ra con đường riêng thay vì đi theo lối mòn có sẵn.',
      'Ở tầng sâu hơn, số 1 phản ánh một cái tôi mạnh mẽ đang trong hành trình học cách khẳng định bản thân mà không cần dựa dẫm vào ai. Đây vừa là món quà (sự tự chủ) vừa là bài học (học cách đứng một mình mà không cô đơn).'
    ],
    strengths: [
      'Quyết đoán, dám chịu trách nhiệm cho quyết định của mình',
      'Có tư duy khởi xướng, không ngại là người đầu tiên thử điều mới',
      'Ý chí mạnh mẽ, kiên định với mục tiêu đã chọn',
      'Truyền cảm hứng hành động cho người xung quanh bằng chính sự chủ động của mình'
    ],
    weaknesses: [
      'Khó làm việc nhóm vì có xu hướng muốn tự mình kiểm soát toàn bộ quy trình, dễ va chạm với đồng nghiệp khi phải nhường quyền quyết định',
      'Trong tình cảm, thường đặt ý kiến bản thân lên trước, dẫn đến bạn đời/người yêu cảm thấy không được lắng nghe',
      'Dễ nóng vội bỏ cuộc giữa chừng khi kết quả không đến nhanh như kỳ vọng, dù ý tưởng ban đầu rất tốt',
      'Sợ thất bại trước đám đông nên đôi khi né tránh những việc không chắc chắn thành công 100%'
    ],
    improvementChecklist: [
      'Trước khi đưa ra quyết định nhóm, chủ động hỏi ý kiến ít nhất 2 người khác và thực sự cân nhắc trước khi chốt',
      'Khi tranh luận với người yêu/bạn đời, tập thói quen nhắc lại ý của đối phương trước khi nêu ý mình, để họ cảm thấy được lắng nghe',
      'Đặt mốc thời gian đánh giá lại dự án (ví dụ: sau 30-60-90 ngày) thay vì đánh giá cảm tính ngay khi chưa thấy kết quả',
      'Ghi lại một "thất bại nhỏ" mỗi tuần và điều học được từ đó, để giảm nỗi sợ thất bại theo thời gian'
    ],
    career: 'Phù hợp với vai trò lãnh đạo, khởi nghiệp, kinh doanh riêng hoặc bất kỳ vị trí được toàn quyền ra quyết định. Tránh môi trường quá nhiều tầng phê duyệt, dễ khiến bạn cảm thấy bị trói buộc.',
    love: 'Cần một người bạn đời đủ vững vàng để không bị lấn át, nhưng cũng đủ bao dung để bạn học cách mềm mỏng hơn. Hôn nhân bền vững khi cả hai thống nhất rõ ai quyết định việc gì thay vì tranh giành quyền chủ động trong mọi chuyện.',
    finance: 'Có bản năng kiếm tiền tốt nhờ dám thử và dám đầu tư vào bản thân, nhưng dễ mất tiền vì quyết định tài chính một mình mà không tham khảo ai. Nên có một người (đối tác, chuyên gia tư vấn) để phản biện các quyết định đầu tư lớn trước khi xuống tiền.'
  },
  2: {
    label: 'Người Hòa Giải',
    coreMeaning: [
      'Số 2 là con số của sự hợp tác, nhạy cảm và khả năng kết nối. Đây là năng lượng của người luôn tìm cách dung hòa các mâu thuẫn, tin rằng hai người cùng làm sẽ tốt hơn một người làm một mình.',
      'Ở tầng sâu, số 2 đang học bài học về giá trị bản thân: học cách coi trọng ý kiến, cảm xúc của chính mình ngang bằng với người khác, thay vì luôn đặt nhu cầu của người khác lên trước.'
    ],
    strengths: [
      'Khả năng lắng nghe và thấu hiểu cảm xúc người khác một cách tinh tế',
      'Giỏi ngoại giao, hòa giải mâu thuẫn giữa các bên',
      'Kiên nhẫn, sẵn sàng chờ đợi thời điểm phù hợp thay vì hành động vội vàng',
      'Trung thành, đáng tin cậy trong các mối quan hệ hợp tác'
    ],
    weaknesses: [
      'Sợ xung đột đến mức im lặng chịu đựng ngay cả khi bị đối xử bất công, dẫn đến tích tụ ấm ức lâu dài',
      'Khó đưa ra quyết định độc lập, luôn cần xác nhận từ người khác trước khi hành động',
      'Trong công việc, dễ bị lu mờ vì ngại thể hiện đóng góp của bản thân trước tập thể',
      'Nhạy cảm quá mức với lời phê bình, dễ suy diễn tiêu cực từ những nhận xét trung lập'
    ],
    improvementChecklist: [
      'Mỗi khi không đồng ý với ai đó, tập nói ra một câu thể hiện quan điểm của mình trước khi đồng ý theo họ',
      'Viết ra 3 đóng góp cụ thể của bản thân trong công việc mỗi tháng để tự nhắc nhở giá trị của mình',
      'Khi nhận phản hồi, dành 24 giờ trước khi phản ứng để tránh suy diễn cảm tính',
      'Đặt một ranh giới nhỏ mỗi tuần (ví dụ: từ chối một yêu cầu không hợp lý) để luyện tập bảo vệ nhu cầu bản thân'
    ],
    career: 'Phù hợp làm việc nhóm, nhân sự, tư vấn, ngoại giao, trợ lý điều hành hoặc các vai trò kết nối/hỗ trợ. Phát huy tốt nhất khi làm việc cùng một đối tác/lãnh đạo mạnh mẽ để bổ trợ lẫn nhau.',
    love: 'Là người bạn đời chu đáo, luôn ưu tiên sự hòa hợp trong gia đình. Cần học cách chia sẻ mong muốn thật của mình thay vì luôn nhường nhịn, để tránh tích tụ ấm ức dẫn đến bùng nổ sau này.',
    finance: 'Có xu hướng để người khác quyết định các vấn đề tài chính lớn trong gia đình. Nên chủ động tham gia lập kế hoạch tài chính chung, ít nhất nắm rõ tình hình thu chi, để không bị động khi có biến cố.'
  },
  3: {
    label: 'Người Sáng Tạo',
    coreMeaning: [
      'Số 3 là con số của sự sáng tạo, biểu đạt và niềm vui sống. Đây là năng lượng của người nhìn thế giới qua lăng kính nghệ thuật, luôn tìm cách biến ý tưởng thành lời nói, hình ảnh hay cảm xúc để chia sẻ với mọi người.',
      'Ở tầng sâu, số 3 đang học cách biến sự sáng tạo bồng bột thành kỷ luật bền vững — làm sao để một ý tưởng hay không chỉ dừng ở cảm hứng ban đầu mà thực sự đi đến kết quả.'
    ],
    strengths: [
      'Óc sáng tạo phong phú, luôn có nhiều ý tưởng mới mẻ',
      'Khả năng giao tiếp, kể chuyện cuốn hút người nghe',
      'Lạc quan, mang năng lượng tích cực lan tỏa đến người xung quanh',
      'Linh hoạt, dễ thích nghi với môi trường mới'
    ],
    weaknesses: [
      'Dễ bắt đầu nhiều việc cùng lúc nhưng khó hoàn thành trọn vẹn vì mất hứng thú khi phần khó khăn xuất hiện',
      'Có xu hướng né tránh cảm xúc tiêu cực bằng cách pha trò hoặc chuyển chủ đề, thay vì đối diện thực sự',
      'Chi tiêu theo cảm hứng, dễ mua sắm bốc đồng khi vui hoặc buồn',
      'Lời nói đôi khi thiếu suy nghĩ trước, dễ làm tổn thương người khác mà không cố ý'
    ],
    improvementChecklist: [
      'Chọn một dự án đang dang dở và đặt deadline hoàn thành cụ thể trong 2 tuần tới, không bắt đầu việc mới cho tới khi xong',
      'Khi buồn/lo lắng, thử ngồi yên 5 phút viết ra cảm xúc thật trước khi tìm cách "vui lên" bằng hoạt động khác',
      'Áp dụng quy tắc chờ 24 giờ trước khi mua bất kỳ món đồ nào không nằm trong kế hoạch chi tiêu',
      'Trước khi nói điều gì có thể nhạy cảm, dừng lại 3 giây tự hỏi "điều này có cần thiết và tử tế không"'
    ],
    career: 'Tỏa sáng trong nghệ thuật, truyền thông, marketing, giải trí, viết lách, MC/diễn giả — bất kỳ công việc nào cần sự sáng tạo và biểu đạt. Cần một người đồng đội thực tế để giúp hiện thực hóa ý tưởng thành kết quả cụ thể.',
    love: 'Mang lại niềm vui và sự lãng mạn cho mối quan hệ, nhưng cần rèn luyện sự nhất quán và trung thực về cảm xúc thay vì né tránh những cuộc trò chuyện khó khăn.',
    finance: 'Dễ chi tiêu theo cảm xúc, nên thiết lập một khoản tiết kiệm tự động hàng tháng trước khi có cơ hội tiêu vào việc khác. Việc nhờ ứng dụng hoặc người thân theo dõi chi tiêu hộ cũng rất hữu ích.'
  },
  4: {
    label: 'Người Xây Dựng',
    coreMeaning: [
      'Số 4 là con số của nền tảng, kỷ luật và sự bền vững. Đây là năng lượng của người xây nhà từ móng, tin rằng thành công thật sự phải được xây từng viên gạch một, không có đường tắt.',
      'Ở tầng sâu, số 4 đang học bài học về sự tin tưởng: tin rằng công sức bỏ ra hôm nay sẽ được đền đáp, ngay cả khi chưa thấy kết quả ngay lập tức.'
    ],
    strengths: [
      'Đáng tin cậy tuyệt đối, nói được làm được, đúng deadline',
      'Khả năng tổ chức, lên kế hoạch chi tiết và thực thi có hệ thống',
      'Kiên trì bền bỉ, không bỏ cuộc giữa chừng',
      'Trung thực, thẳng thắn, không thích vòng vo'
    ],
    weaknesses: [
      'Quá cứng nhắc với kế hoạch đã lập, khó xoay chuyển khi tình huống thực tế thay đổi đột ngột',
      'Xu hướng làm việc quá sức vì tin rằng "chăm chỉ hơn" luôn là câu trả lời, dẫn đến kiệt sức (burnout)',
      'Trong tình cảm, thể hiện tình yêu qua hành động (chu cấp, chăm lo) nhưng ít nói lời yêu thương, khiến đối phương cảm thấy thiếu lãng mạn',
      'Khó tha thứ khi ai đó phá vỡ nguyên tắc/lời hứa, dễ giữ trong lòng thành định kiến lâu dài'
    ],
    improvementChecklist: [
      'Mỗi khi lập kế hoạch, chủ động thêm một "phương án B" ngay từ đầu để không hoảng khi kế hoạch A trục trặc',
      'Đặt giới hạn giờ làm việc cụ thể trong ngày (ví dụ: không quá 9 tiếng) và thực sự tuân thủ nó như một "nguyên tắc" — thứ bạn vốn tôn trọng',
      'Chủ động nói một câu yêu thương bằng lời (không chỉ bằng hành động) mỗi ngày với người quan trọng',
      'Khi thất vọng vì ai đó thất hứa, viết ra cụ thể điều bạn cần ở họ thay vì im lặng giữ trong lòng'
    ],
    career: 'Phù hợp với các ngành cần tính hệ thống cao: kỹ thuật, xây dựng, tài chính - kế toán, quản lý vận hành, logistics. Là người quản lý dự án đáng tin cậy, nhưng nên tránh vai trò cần sáng tạo/xoay chuyển liên tục.',
    love: 'Là chỗ dựa vững chắc và ổn định nhất trong mối quan hệ, nhưng cần chủ động học cách thể hiện cảm xúc bằng lời nói, không chỉ bằng hành động, để bạn đời cảm nhận được tình cảm rõ ràng hơn.',
    finance: 'Tiết kiệm và quản lý tài chính rất tốt, ít khi chi tiêu bốc đồng. Điểm cần lưu ý là đôi khi quá thận trọng, bỏ lỡ cơ hội đầu tư tốt vì sợ rủi ro — nên cân nhắc dành 10-20% tài sản cho các kênh đầu tư có rủi ro vừa phải để tăng trưởng tài sản nhanh hơn.'
  },
  5: {
    label: 'Người Tự Do',
    coreMeaning: [
      'Số 5 là con số của sự tự do, thay đổi và trải nghiệm. Đây là năng lượng của người luôn khao khát khám phá những chân trời mới, không chấp nhận bị giới hạn trong một khuôn khổ cố định.',
      'Ở tầng sâu, số 5 đang học bài học về sự cam kết: làm sao để tận hưởng tự do mà không biến nó thành cái cớ để trốn tránh trách nhiệm hay các mối quan hệ sâu sắc.'
    ],
    strengths: [
      'Thích nghi nhanh với thay đổi, không ngại môi trường mới',
      'Ham học hỏi, tò mò với nhiều lĩnh vực khác nhau',
      'Giao tiếp cởi mở, dễ kết bạn ở bất kỳ đâu',
      'Dũng cảm chấp nhận rủi ro để có trải nghiệm mới'
    ],
    weaknesses: [
      'Dễ chán nản và bỏ cuộc khi một công việc/mối quan hệ trở nên lặp lại, quen thuộc',
      'Có xu hướng né tránh cam kết dài hạn (công việc, tình cảm) vì sợ bị "trói buộc"',
      'Kiểm soát sự bốc đồng kém — dễ đưa ra quyết định lớn (nghỉ việc, chia tay, chi tiêu) trong lúc nhất thời',
      'Khó duy trì kỷ luật với những việc nhàm chán nhưng cần thiết (sổ sách, thủ tục, việc lặp lại hàng ngày)'
    ],
    improvementChecklist: [
      'Trước khi đưa ra quyết định lớn khi đang cảm thấy "muốn thay đổi tất cả", chờ ít nhất 1 tuần rồi quyết định lại',
      'Đặt ra một cam kết nhỏ (dự án 90 ngày, thói quen mới) và theo hết dù có lúc thấy nhàm chán',
      'Tìm cách "làm mới" công việc hiện tại (học kỹ năng mới, đổi cách làm) trước khi nghĩ đến việc bỏ hẳn',
      'Dành 15 phút mỗi ngày cho một việc nhàm chán nhưng cần thiết, biến nó thành thói quen nhỏ thay vì né tránh'
    ],
    career: 'Phù hợp với công việc năng động, ít lặp lại: du lịch, bán hàng, truyền thông, khởi nghiệp, freelance. Cần môi trường có không gian tự chủ về thời gian và cách làm việc.',
    love: 'Hấp dẫn và thú vị, nhưng cần chủ động xây dựng lòng tin bằng sự nhất quán, để người yêu không cảm thấy bất an vì tính khó đoán của bạn. Hôn nhân bền vững khi cả hai thống nhất về "không gian tự do" mà mỗi người cần.',
    finance: 'Thu nhập có thể không ổn định do tính chất công việc đa dạng, nên cần một quỹ dự phòng đủ 3-6 tháng chi tiêu để yên tâm khi có giai đoạn chuyển đổi. Tránh đầu tư theo phong trào/cảm hứng nhất thời.'
  },
  6: {
    label: 'Người Nuôi Dưỡng',
    coreMeaning: [
      'Số 6 là con số của trách nhiệm, tình yêu thương và sự chăm sóc. Đây là năng lượng của người luôn đặt hạnh phúc của gia đình, cộng đồng lên hàng đầu, sẵn sàng hy sinh lợi ích cá nhân vì người khác.',
      'Ở tầng sâu, số 6 đang học cách yêu thương mà không đánh mất chính mình — biết chăm sóc người khác nhưng vẫn giữ được ranh giới và nhu cầu riêng.'
    ],
    strengths: [
      'Giàu lòng trắc ẩn, luôn sẵn sàng giúp đỡ người khác',
      'Có trách nhiệm cao với gia đình và cộng đồng',
      'Óc thẩm mỹ tốt, biết tạo không gian sống ấm cúng, hài hòa',
      'Đáng tin cậy, là điểm tựa tinh thần cho người xung quanh'
    ],
    weaknesses: [
      'Xu hướng ôm đồm trách nhiệm không phải của mình, dẫn đến quá tải và kiệt sức vì lo cho người khác',
      'Có thể trở nên kiểm soát, áp đặt "điều tốt" của mình lên người khác mà không hỏi họ có muốn không',
      'Khó nói "không" với yêu cầu giúp đỡ, dù bản thân đang không đủ nguồn lực',
      'Dễ cảm thấy tổn thương/oán trách khi sự hy sinh của mình không được ghi nhận đúng mức'
    ],
    improvementChecklist: [
      'Trước khi nhận giúp đỡ ai, tự hỏi "mình có đủ thời gian/năng lượng cho việc này không" và cho phép bản thân từ chối nếu cần',
      'Khi muốn góp ý cho người thân, hỏi "bạn có muốn nghe ý kiến của mình không" trước khi nói, thay vì áp đặt luôn',
      'Dành ít nhất một khung giờ cố định mỗi tuần chỉ để chăm sóc bản thân, không phải cho ai khác',
      'Khi cảm thấy không được ghi nhận, chủ động nói ra cảm xúc đó thay vì im lặng chịu đựng rồi oán trách'
    ],
    career: 'Phù hợp với giáo dục, y tế, chăm sóc sức khỏe, tư vấn, nhân sự, hoặc các công việc phục vụ cộng đồng. Cần học cách đặt giới hạn công việc rõ ràng để tránh kiệt sức vì ôm đồm.',
    love: 'Là người bạn đời/cha mẹ tận tụy, luôn đặt gia đình lên hàng đầu. Hạnh phúc bền vững khi học được cách chăm sóc bản thân song song với chăm sóc người khác, và để người thân tự chịu trách nhiệm với cuộc sống của họ.',
    finance: 'Dễ chi tiêu quá tay cho gia đình, người thân đến mức ảnh hưởng tài chính cá nhân. Nên lập ngân sách rõ ràng cho khoản "giúp đỡ người khác" để không vượt quá khả năng của mình.'
  },
  7: {
    label: 'Người Tìm Kiếm Chân Lý',
    coreMeaning: [
      'Số 7 là con số của trí tuệ, sự chiêm nghiệm và hành trình tìm kiếm chân lý. Đây là năng lượng của người luôn đặt câu hỏi "tại sao" đằng sau mọi hiện tượng, không chấp nhận câu trả lời hời hợt.',
      'Ở tầng sâu, số 7 đang học cách kết nối giữa thế giới nội tâm phong phú của mình với thế giới bên ngoài — làm sao để chia sẻ những gì mình hiểu mà không cảm thấy bị hiểu lầm hay cô đơn.'
    ],
    strengths: [
      'Tư duy phân tích sâu sắc, nhìn thấy những điều người khác bỏ qua',
      'Khả năng tập trung cao độ khi nghiên cứu một chủ đề yêu thích',
      'Trực giác nhạy bén, thường "cảm" đúng trước khi có đủ dữ kiện để chứng minh',
      'Độc lập trong tư duy, không dễ bị đám đông tác động'
    ],
    weaknesses: [
      'Có xu hướng cô lập bản thân khi gặp áp lực, thay vì tìm kiếm sự hỗ trợ từ người khác',
      'Khó mở lòng chia sẻ cảm xúc thật, khiến người thân/người yêu cảm thấy bị giữ khoảng cách dù ở bên nhau',
      'Dễ trở nên hoài nghi, phân tích quá mức một vấn đề nhỏ đến mức chậm ra quyết định',
      'Có thể tỏ ra lạnh lùng hoặc kiêu ngạo trong mắt người khác khi thực chất chỉ đang cần không gian riêng'
    ],
    improvementChecklist: [
      'Khi cảm thấy quá tải, chủ động nhắn cho một người thân thiết rằng "mình cần chút thời gian yên tĩnh" thay vì im lặng biến mất — để họ hiểu chứ không hiểu lầm',
      'Mỗi tuần chia sẻ ít nhất một cảm xúc thật (không phải suy nghĩ/phân tích) với người mình tin tưởng',
      'Đặt giới hạn thời gian cho việc ra quyết định nhỏ (ví dụ: 10 phút) để tránh phân tích quá mức những việc không đáng',
      'Chủ động tham gia một hoạt động xã hội/nhóm nhỏ đều đặn mỗi tháng để cân bằng lại xu hướng cô lập'
    ],
    career: 'Tỏa sáng trong nghiên cứu, khoa học, công nghệ, phân tích dữ liệu, tâm lý học hoặc bất kỳ lĩnh vực chuyên sâu cần tư duy độc lập. Cần không gian làm việc yên tĩnh, tránh môi trường quá ồn ào/nhiều tương tác liên tục.',
    love: 'Cần một người bạn đời kiên nhẫn, không đòi hỏi phải chia sẻ mọi thứ ngay lập tức, và tôn trọng nhu cầu không gian riêng của bạn. Tình yêu bền vững khi cả hai xây dựng được sự tin tưởng đủ sâu để bạn tự nguyện mở lòng.',
    finance: 'Ít quan tâm đến tiền bạc vì mải theo đuổi tri thức/đam mê, dễ bỏ qua các cơ hội tài chính đơn giản trước mắt. Nên dành thời gian tìm hiểu kiến thức tài chính cơ bản, hoặc tin tưởng giao việc này cho một người cố vấn tài chính đáng tin cậy.'
  },
  8: {
    label: 'Quyền Lực & Thành Công',
    coreMeaning: [
      'Số 8 là con số của quyền lực, tham vọng và thành tựu vật chất. Đây là năng lượng của người có tầm nhìn lớn, khả năng tổ chức và bản năng nhạy bén với tiền bạc, cơ hội kinh doanh.',
      'Ở tầng sâu, số 8 đang học cách cân bằng giữa thành công bên ngoài và giá trị bên trong — làm sao để quyền lực và tiền bạc phục vụ cho một cuộc sống ý nghĩa, thay vì trở thành mục đích duy nhất.'
    ],
    strengths: [
      'Tầm nhìn chiến lược, khả năng nhìn thấy bức tranh lớn',
      'Bản năng kinh doanh và quản lý tài chính nhạy bén',
      'Ý chí mạnh mẽ, sẵn sàng làm việc chăm chỉ để đạt mục tiêu',
      'Khả năng lãnh đạo, tổ chức đội nhóm hiệu quả'
    ],
    weaknesses: [
      'Dễ đánh giá bản thân và người khác qua thành công vật chất, tiền bạc, dẫn đến áp lực liên tục phải "thắng"',
      'Có xu hướng làm việc quá mức, hy sinh thời gian cho gia đình/sức khỏe vì mục tiêu sự nghiệp',
      'Cứng rắn, đôi khi thiếu sự mềm mỏng trong cách giao tiếp khiến người khác cảm thấy bị áp lực',
      'Khó chấp nhận thất bại hoặc mất kiểm soát một tình huống, dễ trở nên căng thẳng thái quá'
    ],
    improvementChecklist: [
      'Đặt ra ít nhất một mục tiêu KHÔNG liên quan đến tiền bạc/thành tựu mỗi quý (sức khỏe, mối quan hệ, sở thích) và theo đuổi nghiêm túc như mục tiêu công việc',
      'Lên lịch cụ thể thời gian dành cho gia đình mỗi tuần và coi đó là cuộc hẹn không thể hủy, giống một cuộc họp quan trọng',
      'Khi giao tiếp với đội nhóm, thực hành hỏi cảm nhận của họ trước khi đưa ra chỉ đạo',
      'Khi gặp thất bại, viết ra 3 điều học được thay vì chỉ tập trung vào việc "phải sửa sai ngay"'
    ],
    career: 'Phù hợp làm kinh doanh, quản lý cấp cao, tài chính, bất động sản, đầu tư. Phát huy tốt nhất khi được toàn quyền quyết định chiến lược và ngân sách.',
    love: 'Mạnh mẽ và có trách nhiệm bảo vệ, chu cấp cho gia đình, nhưng cần chủ động dành thời gian chất lượng (không chỉ tiền bạc) cho người thân để họ cảm nhận được sự hiện diện thực sự.',
    finance: 'Có khả năng tạo ra và tích lũy tài sản lớn, tuy nhiên cần cẩn trọng với xu hướng đặt cược lớn khi tự tin thái quá. Nên có nguyên tắc quản trị rủi ro rõ ràng (ví dụ: không đầu tư quá một tỷ lệ % tài sản vào một kênh) để bảo toàn thành quả đã gây dựng.'
  },
  9: {
    label: 'Lòng Nhân Ái',
    coreMeaning: [
      'Số 9 là con số của sự hoàn tất, lòng vị tha và tầm nhìn nhân văn. Đây là năng lượng của người luôn hướng đến những giá trị lớn lao hơn bản thân, quan tâm đến cộng đồng và thế giới xung quanh.',
      'Ở tầng sâu, số 9 đang học bài học về sự buông bỏ — biết khi nào nên khép lại một chương để mở ra chương mới, thay vì cố bám víu vào những gì đã không còn phù hợp.'
    ],
    strengths: [
      'Lòng trắc ẩn sâu sắc, dễ đồng cảm với nỗi đau của người khác',
      'Tầm nhìn rộng, quan tâm đến các vấn đề lớn của xã hội/nhân loại',
      'Hào phóng, sẵn sàng cho đi mà không toan tính',
      'Khả năng truyền cảm hứng bằng chính sự chân thành của mình'
    ],
    weaknesses: [
      'Khó buông bỏ những mối quan hệ/công việc đã không còn phù hợp vì cảm giác tiếc nuối hoặc tội lỗi khi rời đi',
      'Dễ ôm đồm nỗi đau của cả thế giới, dẫn đến kiệt sức về cảm xúc',
      'Có xu hướng lý tưởng hóa mọi thứ, dễ thất vọng khi thực tế không như kỳ vọng',
      'Cho đi quá nhiều mà quên chăm sóc nhu cầu vật chất/tài chính của bản thân'
    ],
    improvementChecklist: [
      'Khi một mối quan hệ/công việc rõ ràng không còn phù hợp, viết ra lý do nên rời đi và đọc lại mỗi khi do dự',
      'Đặt giới hạn về lượng tin tức tiêu cực tiếp nhận mỗi ngày để tránh kiệt sức cảm xúc',
      'Khi cho đi (tiền, thời gian, công sức), tự hỏi "mình có đang cho đi trong khả năng, không tổn hại bản thân không"',
      'Mỗi tháng dành ra một khoản nhỏ cho chính nhu cầu của bản thân trước khi nghĩ đến việc giúp đỡ người khác'
    ],
    career: 'Phù hợp với công tác thiện nguyện, nghệ thuật, giáo dục, y tế, hoặc các tổ chức phi lợi nhuận. Cũng có thể thành công trong kinh doanh nếu gắn với sứ mệnh xã hội rõ ràng.',
    love: 'Yêu thương bao dung và thấu cảm sâu sắc, nhưng cần học cách đặt ra ranh giới lành mạnh để không đánh mất bản thân trong việc chăm lo cho người khác.',
    finance: 'Dễ cho đi quá mức đến mức ảnh hưởng tài chính cá nhân. Nên thiết lập nguyên tắc rõ ràng về mức có thể cho đi (ví dụ: một tỷ lệ % thu nhập cố định) để vừa giữ được lòng hào phóng vừa đảm bảo an toàn tài chính của chính mình.'
  },
  11: {
    label: 'Bậc Thầy Trực Giác',
    coreMeaning: [
      'Số 11 là số Master đầu tiên, mang gấp đôi năng lượng của số 2 (hợp tác, nhạy cảm) nhưng ở tầng cao hơn: trực giác, tâm linh và khả năng truyền cảm hứng. Đây là con số của những người "nhìn thấy" nhiều hơn người bình thường, thường cảm nhận được năng lượng, cảm xúc của người khác một cách rõ rệt.',
      'Là số Master, số 11 mang theo tiềm năng lớn nhưng đi kèm áp lực lớn tương ứng — nhiều người mang số 11 cảm thấy mình "khác biệt" từ nhỏ, đôi khi khó hòa nhập vì độ nhạy cảm cao hơn hẳn xung quanh.'
    ],
    strengths: [
      'Trực giác cực kỳ nhạy bén, thường "biết trước" điều gì đó sắp xảy ra',
      'Khả năng truyền cảm hứng, thu hút người khác bằng chính năng lượng của mình',
      'Nhạy cảm sâu sắc với nghệ thuật, tâm linh, cảm xúc con người',
      'Tầm nhìn mang tính lý tưởng, luôn muốn tạo ra điều gì đó ý nghĩa hơn cho thế giới'
    ],
    weaknesses: [
      'Dễ bị quá tải cảm xúc/năng lượng khi ở trong môi trường đông người hoặc nhiều xung đột (dễ "hấp thụ" cảm xúc người khác)',
      'Áp lực tự đặt ra rất lớn để sống xứng đáng với tiềm năng của mình, dễ dẫn đến lo âu, tự ti khi chưa đạt được',
      'Thiếu thực tế, đôi khi mơ mộng quá xa mà chưa có kế hoạch cụ thể để biến ý tưởng thành hiện thực',
      'Dễ hoài nghi chính trực giác của mình, không dám tin và hành động theo những gì mình "cảm nhận được"'
    ],
    improvementChecklist: [
      'Dành thời gian ở một mình mỗi ngày (thiền, đi bộ, viết nhật ký) để "xả" năng lượng đã hấp thụ từ người khác',
      'Khi có một ý tưởng lớn, viết ra ít nhất 3 bước hành động cụ thể đầu tiên thay vì chỉ dừng ở tầm nhìn',
      'Ghi lại những lần trực giác của mình đã đúng để dần xây dựng lòng tin vào bản thân',
      'Nhắc bản thân rằng "tiềm năng lớn" không có nghĩa là phải hoàn hảo ngay lập tức — cho phép mình phát triển từng bước'
    ],
    career: 'Phù hợp với vai trò diễn giả, cố vấn, nhà trị liệu, nghệ sĩ, người làm công tác tâm linh/tinh thần, hoặc bất kỳ công việc cần sự thấu cảm và truyền cảm hứng sâu sắc. Cần môi trường cho phép thể hiện sự nhạy cảm thay vì phải "cứng rắn" liên tục.',
    love: 'Yêu sâu sắc và lý tưởng hóa người mình yêu, cần một người bạn đời đủ vững vàng, thực tế để cân bằng với sự bay bổng của bạn, đồng thời đủ thấu hiểu để không làm tổn thương sự nhạy cảm của bạn.',
    finance: 'Dễ đưa ra quyết định tài chính theo cảm tính/trực giác — đôi khi đúng nhưng rủi ro cao khi thiếu phân tích thực tế đi kèm. Nên kết hợp trực giác với dữ liệu cụ thể, hoặc tham khảo người có tư duy thực tế trước khi quyết định lớn.'
  },
  22: {
    label: 'Kiến Tạo Bậc Thầy',
    coreMeaning: [
      'Số 22 là số Master mạnh nhất trong thần số học, mang năng lượng gấp đôi của số 4 (xây dựng, kỷ luật) nhưng ở quy mô lớn hơn nhiều: khả năng biến những giấc mơ, ý tưởng lớn lao thành hiện thực cụ thể, có tầm ảnh hưởng đến nhiều người.',
      'Đây là con số của "người kiến tạo bậc thầy" — không chỉ mơ lớn như số 11 mà còn có khả năng thực thi để biến giấc mơ đó thành công trình thực sự tồn tại. Đi kèm với tiềm năng lớn là áp lực rất lớn để không lãng phí khả năng hiếm có này.'
    ],
    strengths: [
      'Tầm nhìn lớn kết hợp khả năng thực thi thực tế — hiếm ai có cả hai cùng lúc',
      'Khả năng tổ chức, quản lý nguồn lực và con người ở quy mô lớn',
      'Kiên trì bền bỉ theo đuổi mục tiêu dài hạn, không ngại khó khăn',
      'Có sức ảnh hưởng tự nhiên, người khác tin tưởng đi theo tầm nhìn của bạn'
    ],
    weaknesses: [
      'Áp lực tự đặt ra cực lớn để đạt được điều "vĩ đại", dễ dẫn đến căng thẳng mãn tính hoặc kiệt sức',
      'Có xu hướng ôm đồm mọi việc vì tin rằng chỉ mình mới làm đúng, khó ủy quyền cho người khác',
      'Dễ trở nên cứng nhắc, coi kế hoạch/hệ thống quan trọng hơn cảm xúc của những người xung quanh',
      'Sợ thất bại ở quy mô lớn đến mức đôi khi trì hoãn bắt đầu vì muốn mọi thứ hoàn hảo ngay từ đầu'
    ],
    improvementChecklist: [
      'Chia dự án lớn thành các mốc nhỏ (30-60-90 ngày) để giảm áp lực "phải hoàn hảo ngay"',
      'Chủ động giao ít nhất một phần việc quan trọng cho người khác mỗi tháng và luyện tập tin tưởng họ',
      'Đặt lịch nghỉ ngơi cố định (không thương lượng) mỗi tuần để tránh kiệt sức vì ôm đồm',
      'Khi cảm thấy áp lực phải "vĩ đại", nhắc bản thân rằng tiến bộ từng bước cũng là thành công'
    ],
    career: 'Phù hợp với vai trò kiến tạo hệ thống, lãnh đạo tổ chức lớn, doanh nhân, kiến trúc sư (nghĩa đen lẫn nghĩa bóng), hoặc các dự án tầm cỡ quốc gia/quốc tế. Cần xây dựng đội ngũ đáng tin cậy để san sẻ khối lượng công việc khổng lồ.',
    love: 'Cần một người bạn đời kiên nhẫn, thấu hiểu tham vọng lớn và sự bận rộn trong hành trình của bạn, đồng thời đủ mạnh mẽ để nhắc bạn cân bằng giữa công việc và gia đình.',
    finance: 'Có khả năng tạo ra tài sản/giá trị ở quy mô lớn, nhưng cũng đi kèm rủi ro tương ứng khi các dự án lớn không như kỳ vọng. Cần có kế hoạch quản trị rủi ro chặt chẽ và không dồn toàn bộ nguồn lực vào một dự án duy nhất.'
  },
  33: {
    label: 'Người Thầy Bậc Thầy',
    coreMeaning: [
      'Số 33 là số Master hiếm gặp nhất, mang năng lượng gấp đôi của số 6 (nuôi dưỡng, trách nhiệm) nhưng ở tầng vô điều kiện: tình yêu thương, sự hy sinh và khả năng chữa lành, giảng dạy ở mức độ sâu sắc nhất.',
      'Đây là con số của "người thầy của những người thầy" — không chỉ chăm sóc gia đình nhỏ như số 6 mà còn mang sứ mệnh nâng đỡ, dẫn dắt nhiều người khác bằng chính tình yêu thương chân thành, không toan tính.'
    ],
    strengths: [
      'Tình yêu thương vô điều kiện, khả năng chữa lành và nâng đỡ người khác sâu sắc',
      'Trách nhiệm cao với cộng đồng, sẵn sàng cống hiến vì lợi ích chung',
      'Khả năng truyền đạt, giảng dạy những bài học sâu sắc bằng sự chân thành',
      'Kiên nhẫn phi thường khi đồng hành cùng người khác vượt qua khó khăn'
    ],
    weaknesses: [
      'Hy sinh bản thân đến mức quên mất nhu cầu, ranh giới của chính mình, dễ dẫn đến kiệt sức toàn diện',
      'Gánh trách nhiệm của cả những người không nhờ mình gánh, tự đặt áp lực phải "cứu giúp" mọi người',
      'Khó chấp nhận khi những người mình giúp đỡ không thay đổi/tiến bộ như mong đợi, dễ thất vọng sâu sắc',
      'Ít khi cho phép bản thân được yếu đuối hoặc nhận sự giúp đỡ từ người khác'
    ],
    improvementChecklist: [
      'Trước khi nhận gánh vác trách nhiệm của ai đó, tự hỏi "đây có thực sự là việc của mình không"',
      'Thực hành nhận sự giúp đỡ từ người khác ít nhất 1 lần/tuần, dù là việc nhỏ',
      'Nhắc bản thân rằng mỗi người có hành trình riêng — giúp đỡ là gieo hạt, không phải ép buộc kết quả',
      'Dành thời gian chăm sóc bản thân (nghỉ ngơi, sở thích riêng) như một ưu tiên, không phải điều "xa xỉ"'
    ],
    career: 'Tỏa sáng trong giáo dục, chữa lành (y tế, tâm lý trị liệu), công tác xã hội, hoặc bất kỳ vai trò dẫn dắt/cố vấn cho nhiều người. Cần học cách đặt giới hạn để duy trì bền vững trong sứ mệnh phụng sự lâu dài.',
    love: 'Yêu thương sâu sắc và sẵn sàng hy sinh rất nhiều cho người thân yêu. Cần học cách nhận lại tình yêu thương từ đối phương, không chỉ luôn ở vai trò "người cho đi", để mối quan hệ được cân bằng và bền vững.',
    finance: 'Rất dễ đặt nhu cầu tài chính của người khác lên trên nhu cầu của bản thân. Nên có một khoản tiết kiệm/bảo hiểm riêng không được dùng để giúp đỡ người khác, đảm bảo an toàn tài chính cho chính mình trước.'
  }
};

// ===== Export cho Node.js (unit test) — không ảnh hưởng khi chạy trong browser =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LETTER_VALUES, VOWELS, stripDiacritics, nameToLetters, sumLetterValues,
    digitsSum, reduceNumber, reduceToSingle, reduceWithKarmic, KARMIC_DEBT_NUMS,
    KARMIC_DEBT_MEANINGS, NUMEROLOGY_MEANINGS, CHALLENGE_MEANINGS,
    PERSONAL_YEAR_MEANINGS, PINNACLE_MEANINGS, DECADE_THEMES,
    computePinnacles, personalYearOf, modeOf, computeSixtyYearLife, computeNumerology,
    NUMEROLOGY_CONTENT_DETAILED
  };
}
