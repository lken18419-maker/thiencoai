/* =============================================
   NỘI DUNG LUẬN GIẢI CHUYÊN SÂU — 14 CHÍNH TINH TẠI CUNG MỆNH
   + trường hợp Vô Chính Diệu (Mệnh không có chính tinh)

   Đây là nội dung cá nhân hóa theo ĐÚNG chính tinh thực tế đang
   đóng ở Cung Mệnh của từng lá số (không còn là câu random xoay
   vòng theo seed như trước). Mỗi sao được biên soạn theo cấu trúc
   6 phần: coreMeaning (bản chất), strengths (điểm mạnh), weaknesses
   (điểm cần lưu ý), career (sự nghiệp), love (tình duyên), wealth
   (tài lộc), health (sức khỏe), advice (lời khuyên).

   Nội dung được biên soạn dựa trên đối chiếu nhiều nguồn tử vi đẩu
   số truyền thống phổ biến tại Việt Nam (không sao chép nguyên văn
   từ bất kỳ một tác phẩm cụ thể nào) — phản ánh ý nghĩa CĂN BẢN của
   từng sao khi thủ Mệnh, CHƯA tính đến yếu tố Miếu/Vượng/Đắc/Hãm
   theo từng cung vị cụ thể hay các sao phụ tinh đi kèm (Tả Hữu,
   Xương Khúc, Không Kiếp...). Đây là điểm cần lưu ý khi đọc báo cáo:
   nội dung là chân dung CĂN BẢN của sao thủ mệnh, mang tính tham
   khảo chuyên sâu chứ không thay thế luận giải trực tiếp của
   chuyên gia có xét đầy đủ cách cục.
   ============================================= */

const TUVI_STAR_CONTENT = {
  'Tử Vi': {
    label: 'Đế Tinh — Bậc Quân Vương',
    coreMeaning: [
      'Tử Vi là chủ tinh quan trọng nhất trong 14 chính tinh, đứng đầu chòm Bắc Đẩu, tượng trưng cho quyền lực, uy nghi và trí tuệ lãnh đạo. Người có Tử Vi thủ Mệnh mang khí chất hơn người, có tố chất đứng đầu, luôn mong muốn được thể hiện bản thân và được người khác tôn trọng.',
      'Tử Vi là sao của người "làm chủ" hơn là người "thừa hành" — dù ở vị trí nào, chủ mệnh cũng có xu hướng tự đặt ra luật chơi hoặc muốn có tiếng nói quyết định. Đây vừa là điểm mạnh (dễ được cất nhắc, dễ quy tụ người khác) vừa là bài học cả đời: học cách lãnh đạo bằng sự phục vụ thay vì chỉ bằng quyền uy.'
    ],
    strengths: [
      'Khí chất lãnh đạo bẩm sinh, dễ được tin tưởng giao trọng trách',
      'Tư duy tổng quan, có khả năng tổ chức và điều phối người khác',
      'Thường gặp quý nhân phù trợ đúng lúc khó khăn',
      'Có lòng tự trọng cao, biết giữ thể diện và chuẩn mực cho bản thân'
    ],
    weaknesses: [
      'Dễ có xu hướng gia trưởng, áp đặt ý kiến khiến người xung quanh ngột ngạt',
      'Coi trọng thể diện quá mức, khó nhận sai hoặc hạ mình xin lỗi',
      'Kỳ vọng người khác phải phục tùng, dễ thất vọng khi không được như ý',
      'Nếu không có sao tốt phù trợ (Tả Hữu, Xương Khúc, Khôi Việt), dễ rơi vào cảnh "vua không ngai" — có chí lớn nhưng thiếu người hỗ trợ'
    ],
    career: 'Rất phù hợp với vai trò quản lý, lãnh đạo tổ chức, hoặc tự kinh doanh riêng — môi trường cho phép chủ mệnh ra quyết định độc lập. Cần tránh vị trí phải phục tùng cấp trên một cách cứng nhắc, dễ sinh bất mãn.',
    love: 'Trong tình cảm, người Tử Vi thủ Mệnh cần một đối tác đủ bản lĩnh để không bị lấn át nhưng cũng đủ mềm mỏng để bổ khuyết cho sự cứng rắn của mình. Hôn nhân bền vững khi cả hai học được cách chia sẻ quyền quyết định thay vì một người luôn đứng trên.',
    wealth: 'Tài lộc thường đến từ vị trí, chức vụ và uy tín hơn là may mắn ngẫu nhiên — càng có địa vị cao, tài chính càng vững. Nên đầu tư vào việc xây dựng thương hiệu cá nhân và mạng lưới quan hệ để tài lộc phát huy tối đa.',
    health: 'Cần chú ý các vấn đề liên quan đến huyết áp, tim mạch do tính cách hay lo nghĩ, gánh vác trách nhiệm nặng nề. Nên giữ thói quen vận động đều đặn và học cách "buông" bớt kỳ vọng để giảm áp lực tinh thần.',
    advice: 'Chìa khóa của Tử Vi thủ Mệnh là học chữ "Nhẫn" và chữ "Khiêm" — càng biết lắng nghe và trọng dụng người tài xung quanh, quyền uy càng vững bền; càng cố giữ thể diện bằng sự áp đặt, càng dễ cô độc trên đỉnh cao.'
  },

  'Thiên Cơ': {
    label: 'Mưu Tinh — Nhà Quân Sư',
    coreMeaning: [
      'Thiên Cơ thuộc hành Mộc, là thiện tinh chủ về trí tuệ, mưu lược và khả năng ứng biến. Trong tử vi, Thiên Cơ được ví như quân sư — người đứng sau hoạch định chứ không phải người xông pha tuyến đầu. Người có Thiên Cơ thủ Mệnh thường thông minh, nhạy bén, giỏi phân tích và luôn có sẵn phương án dự phòng.',
      'Đặc trưng lớn nhất của Thiên Cơ là "biến động" — đầu óc luôn suy nghĩ, luôn muốn tối ưu, khó ở yên một chỗ quá lâu cả về công việc lẫn tư duy. Đây là món quà cho sự sáng tạo nhưng cũng là bài học về việc giữ định hướng nhất quán thay vì thay đổi liên tục theo cảm hứng.'
    ],
    strengths: [
      'Thông minh, hiếu học, tiếp thu kiến thức mới rất nhanh',
      'Giỏi lập kế hoạch, phân tích tình huống và tìm giải pháp sáng tạo',
      'Linh hoạt thích nghi tốt với thay đổi, không ngại thử cái mới',
      'Có trực giác nhạy bén, thường nhìn ra cơ hội trước người khác'
    ],
    weaknesses: [
      'Dễ đa nghi, suy nghĩ quá nhiều dẫn đến lo âu, mất ngủ',
      'Hay thay đổi quyết định giữa chừng, thiếu kiên định với một hướng đi dài hạn',
      'Dễ lao tâm khổ tứ vì ôm đồm nhiều việc cùng lúc',
      'Tình cảm gia đình dễ trục trặc do quá bận tâm suy tính, thiếu thời gian vun đắp'
    ],
    career: 'Phù hợp với công việc tham mưu, nghiên cứu, kỹ thuật, giáo dục, tư vấn chiến lược — nơi phát huy được trí tuệ phân tích. Nên tránh vai trò đòi hỏi hành động quyết liệt, đối đầu trực diện vì không phải sở trường.',
    love: 'Tình duyên của Thiên Cơ thủ Mệnh dễ có nhiều biến động, trải nghiệm trước khi tìm được bến đỗ ổn định. Cần một người bạn đời kiên nhẫn, có thể làm điểm tựa vững chắc để cân bằng cái đầu luôn suy nghĩ của chủ mệnh.',
    wealth: 'Tài lộc đến từ trí tuệ và chất xám nhiều hơn là lao động chân tay — càng đầu tư vào kỹ năng, chuyên môn, tài chính càng cải thiện theo thời gian. Cần tránh đầu cơ theo cảm tính vì dễ thay đổi quyết định giữa chừng gây thua lỗ.',
    health: 'Hệ thần kinh là điểm cần quan tâm nhất — dễ suy nhược, đau đầu, mất ngủ do suy nghĩ quá nhiều. Nên tập thiền, yoga hoặc các bộ môn giúp tĩnh tâm để cân bằng lại một cái đầu luôn hoạt động.',
    advice: 'Thiên Cơ thủ Mệnh nên học cách "chốt" quyết định thay vì mãi phân vân — trí tuệ chỉ thực sự tạo ra giá trị khi được biến thành hành động cụ thể và kiên trì theo đuổi đến cùng.'
  },

  'Thái Dương': {
    label: 'Nhật Tinh — Ánh Sáng Ban Ngày',
    coreMeaning: [
      'Thái Dương thuộc hành Hỏa, tượng trưng cho mặt trời, ánh sáng, trí tuệ và uy quyền — chủ về công danh, quan lộc và hình ảnh người cha/người chồng trong gia đình. Người có Thái Dương thủ Mệnh thường có tính cách mạnh mẽ, thẳng thắn, hào phóng và mang tinh thần trách nhiệm cao.',
      'Bản chất của Thái Dương là "cho đi ánh sáng" — chủ mệnh thường sống vì người khác, thích giúp đỡ, dẫn dắt và tỏa năng lượng tích cực ra xung quanh, đôi khi đến mức quên chăm lo cho chính bản thân mình.'
    ],
    strengths: [
      'Lạc quan, nhiệt huyết, luôn tràn đầy năng lượng tích cực',
      'Chính trực, thẳng thắn, không thích vòng vo giả tạo',
      'Có tinh thần trách nhiệm cao, sẵn sàng gánh vác việc chung',
      'Hào phóng, hay giúp đỡ người khác mà không toan tính'
    ],
    weaknesses: [
      'Dễ nóng tính, bộc trực quá mức khiến người khác mất lòng',
      'Đôi khi quá tự tin, bảo thủ, khó chấp nhận ý kiến trái chiều',
      'Vì lo cho người khác nhiều nên dễ xao nhãng lợi ích và sức khỏe bản thân',
      'Nếu ở vị trí kém thuận lợi, dễ vất vả, danh cao nhưng thực lợi mỏng'
    ],
    career: 'Rất hợp với các nghề mang tính công vụ, quản lý nhà nước, truyền thông, giáo dục, y tế, luật — những lĩnh vực cần đến uy tín và tinh thần phụng sự cộng đồng. Thành công thường gắn liền với danh tiếng hơn là làm việc âm thầm.',
    love: 'Trong tình cảm, người Thái Dương thủ Mệnh chân thành, hết lòng vì đối phương nhưng đôi khi mải mê công việc/xã hội mà quên vun vén gia đình. Cần chủ động dành thời gian riêng cho người thân để cân bằng giữa sự nghiệp và mái ấm.',
    wealth: 'Tài lộc gắn liền với danh tiếng và vị trí xã hội — càng có uy tín, cơ hội tài chính càng mở rộng. Tuy nhiên nên tránh xu hướng "được tiếng mà mất miếng", chi tiêu hào phóng quá mức so với thu nhập thực tế.',
    health: 'Cần chú ý các vấn đề về tim mạch, huyết áp, mắt (liên quan đến hành Hỏa và biểu tượng ánh sáng). Nên cân bằng nhịp sống, tránh làm việc quá sức vì ôm đồm trách nhiệm.',
    advice: 'Thái Dương thủ Mệnh tỏa sáng nhất khi biết soi sáng cho người khác mà không quên giữ lửa cho chính mình — học cách nói "không" đúng lúc sẽ giúp chủ mệnh bền sức trên con đường cống hiến dài hạn.'
  },

  'Vũ Khúc': {
    label: 'Tài Tinh — Ngôi Sao Của Sự Nghiệp Vững Chắc',
    coreMeaning: [
      'Vũ Khúc thuộc hành Kim, được xem là "sao tài lộc" trong tử vi đẩu số, ví như mỏ vàng giữa các chính tinh — mang bản năng kiếm tiền và khát khao ổn định tài chính rất mạnh. Người có Vũ Khúc thủ Mệnh cá tính cương quyết, thực tế, tư duy nhạy bén và ra quyết định nhanh, dứt khoát.',
      'Vũ Khúc là sao của "hành động hơn lời nói" — chủ mệnh ít khi thể hiện cảm xúc ra ngoài, coi trọng kết quả thực tế hơn những lời hoa mỹ, đôi khi vì vậy mà bị hiểu lầm là lạnh lùng, khô khan.'
    ],
    strengths: [
      'Quyết đoán, phản xạ nhanh, không ngại đưa ra quyết định khó khăn',
      'Có tư duy quản lý tài chính tốt, biết tích lũy và đầu tư có tính toán',
      'Ý chí kiên cường, không dễ bỏ cuộc trước khó khăn',
      'Thực tế, đáng tin cậy trong công việc, ít hứa suông'
    ],
    weaknesses: [
      'Cứng nhắc, ít biểu lộ cảm xúc khiến người thân cảm thấy xa cách',
      'Đặt nặng vật chất, đôi khi đánh giá mọi việc qua lăng kính được – mất',
      'Dễ cô đơn, ít bạn tri kỷ do tính cách khép kín, thiên về công việc',
      'Nếu ở vị trí kém thuận lợi, dễ xa quê lập nghiệp, vất vả gây dựng từ hai bàn tay trắng'
    ],
    career: 'Cực kỳ phù hợp với kinh doanh, tài chính, ngân hàng, bất động sản hoặc bất kỳ lĩnh vực nào cần đến sự quyết đoán và khả năng quản lý tiền bạc. Càng độc lập tự chủ trong công việc, Vũ Khúc càng phát huy tối đa năng lực.',
    love: 'Người Vũ Khúc thủ Mệnh cần học cách bày tỏ cảm xúc nhiều hơn, tránh để sự thực dụng lấn át cảm giác ấm áp cần có trong một mối quan hệ. Bạn đời phù hợp là người kiên nhẫn, hiểu rằng sự quan tâm của chủ mệnh thể hiện qua hành động chứ không phải lời nói.',
    wealth: 'Đây là một trong những chính tinh có khả năng tích lũy tài sản tốt nhất — nếu được rèn giũa đúng hướng (học hỏi, tu dưỡng), tài lộc thường đến dồi dào và bền vững theo thời gian, đặc biệt qua kinh doanh hoặc đầu tư có chiến lược.',
    health: 'Cần lưu ý các vấn đề về hô hấp, phổi và xương khớp (liên quan hành Kim). Do tính cách hay dồn nén cảm xúc, nên tìm kênh giải tỏa căng thẳng lành mạnh thay vì chỉ vùi đầu vào công việc.',
    advice: 'Vũ Khúc thủ Mệnh giàu có nhất khi học được cách cân bằng giữa tài lộc và tình cảm — tiền bạc là công cụ để xây dựng hạnh phúc, không phải mục đích cuối cùng thay thế cho các mối quan hệ.'
  },

  'Thiên Đồng': {
    label: 'Phúc Tinh — Ngôi Sao Của Sự An Nhàn',
    coreMeaning: [
      'Thiên Đồng thuộc hành Thủy, là một trong những Phúc Tinh quan trọng nhất, chủ về phúc lộc, thọ mệnh và sự hưởng thụ cuộc sống. Người có Thiên Đồng thủ Mệnh thường hiền hòa, lạc quan, dễ mến và được nhiều người yêu quý vì tính cách ôn hòa, ít va chạm.',
      'Bản chất Thiên Đồng thiên về "hưởng phúc" hơn "tạo dựng" — chủ mệnh dễ bằng lòng với hiện tại, không quá tham vọng bứt phá, nên cuộc đời thường êm đềm nhưng cũng có thể thiếu động lực nếu không có sao trợ lực thúc đẩy.'
    ],
    strengths: [
      'Tính tình hiền hòa, dễ gần, ít gây thù chuốc oán với ai',
      'Khả năng thích nghi tốt, linh hoạt trong nhiều hoàn cảnh sống',
      'Có duyên được người khác giúp đỡ, quý nhân phù trợ đúng lúc',
      'Tinh thần lạc quan, dễ tìm thấy niềm vui trong những điều nhỏ nhặt'
    ],
    weaknesses: [
      'Thiếu tính chủ động, dễ ỷ lại, chờ đợi thay vì tự tạo cơ hội',
      'Ngại thay đổi, dễ an phận khiến tiềm năng không được khai phá hết',
      'Đôi khi quá dễ dãi, thiếu chính kiến trước áp lực từ người khác',
      'Nếu gặp sao xấu đồng cung, phúc dễ biến thành hưởng thụ quá đà, lười biếng'
    ],
    career: 'Phù hợp với môi trường ổn định, ít áp lực cạnh tranh khốc liệt như công chức, dịch vụ, chăm sóc khách hàng, hoặc các ngành nghề mang tính hợp tác, hỗ trợ. Cần thêm sự chủ động để không bỏ lỡ cơ hội thăng tiến.',
    love: 'Trong tình cảm, người Thiên Đồng chân thành, dễ hòa hợp và ít khi gây xung đột lớn với bạn đời. Tuy nhiên cần tránh sự thụ động quá mức — hạnh phúc bền lâu cần cả hai cùng chủ động vun đắp chứ không chỉ một người gánh vác.',
    wealth: 'Tài lộc thường đến một cách nhẹ nhàng, ổn định hơn là đột biến — phù hợp với việc tích lũy dần dần, tránh đầu tư mạo hiểm. Kết hợp tốt với Thái Âm hoặc Thiên Lương sẽ giúp tài chính vững vàng hơn.',
    health: 'Nhìn chung có sức khỏe và tuổi thọ tốt nhờ tinh thần lạc quan, nhưng cần chú ý hệ tiêu hóa và cân nặng do xu hướng hưởng thụ, ít vận động.',
    advice: 'Thiên Đồng thủ Mệnh nên chủ động đặt ra mục tiêu và thời hạn cụ thể cho bản thân — phúc khí chỉ thực sự nở rộ khi có thêm một chút nỗ lực chủ động thay vì chỉ chờ đợi mọi thứ tự đến.'
  },

  'Liêm Trinh': {
    label: 'Tù Tinh — Ngôi Sao Của Hai Mặt Đối Lập',
    coreMeaning: [
      'Liêm Trinh thuộc hành Hỏa, là chính tinh mang tính chất phức tạp và mâu thuẫn nhất trong 14 sao — vừa cương nghị, chính trực, vừa có thể nóng nảy, dễ sa vào cực đoan. Khi ở vị trí thuận lợi, người có Liêm Trinh thủ Mệnh thông minh, có nguyên tắc sống rõ ràng và tư duy logic sắc bén.',
      'Liêm Trinh là sao của "kỷ luật thép" — chủ mệnh coi trọng nguyên tắc, danh dự và sự công bằng, đôi khi đến mức cứng nhắc, khó thỏa hiệp. Đây cũng là sao dễ mang tính đào hoa ẩn, tình cảm nội tâm phức tạp hơn vẻ ngoài lạnh lùng thể hiện.'
    ],
    strengths: [
      'Tư duy logic, có nguyên tắc sống và làm việc rõ ràng',
      'Ý chí kỷ luật cao, khả năng tổ chức và quản lý tốt',
      'Thẳng thắn, trọng danh dự, không thích luồn cúi',
      'Có năng lực xử lý các tình huống phức tạp, nhiều áp lực'
    ],
    weaknesses: [
      'Dễ nóng nảy, cực đoan trong cảm xúc, khó kiểm soát khi bị dồn ép',
      'Nội tâm phức tạp, dễ cô đơn dù bên ngoài mạnh mẽ, tự tin',
      'Tình cảm dễ vướng vào những mối quan hệ éo le, thị phi',
      'Nếu ở vị trí kém thuận lợi, dễ vướng vào kiện tụng, tranh chấp pháp lý'
    ],
    career: 'Rất phù hợp với các lĩnh vực đòi hỏi tính kỷ luật và nguyên tắc cao như luật pháp, hành chính, quân đội, quản lý cấp cao. Nơi làm việc có quy củ rõ ràng sẽ giúp Liêm Trinh phát huy tốt nhất năng lực.',
    love: 'Đời sống tình cảm của Liêm Trinh thủ Mệnh thường không đơn giản, dễ trải qua các giai đoạn thăng trầm trước khi tìm được sự ổn định. Cần học cách mềm mỏng, cởi mở chia sẻ cảm xúc thay vì giữ tất cả trong lòng.',
    wealth: 'Tài lộc thường gắn với vị trí, quyền lực và năng lực quản lý — càng có thực quyền, tài chính càng vững. Cần tránh những quyết định tài chính bốc đồng lúc nóng giận hoặc áp lực.',
    health: 'Cần chú ý sức khỏe tâm thần, tránh căng thẳng kéo dài dẫn đến các vấn đề về tim mạch, huyết áp. Nên có kênh giải tỏa cảm xúc lành mạnh như thể thao cường độ cao.',
    advice: 'Liêm Trinh thủ Mệnh cần học chữ "Hòa" để cân bằng với chữ "Chính" sẵn có — nguyên tắc sống đúng đắn chỉ thực sự có giá trị khi đi cùng sự bao dung, mềm mỏng với những người xung quanh.'
  },

  'Thiên Phủ': {
    label: 'Khố Tinh — Kho Báu Của Trời',
    coreMeaning: [
      'Thiên Phủ thuộc hành Thổ, đứng đầu chòm Nam Đẩu, được ví như "kho báu của trời" — chủ về quyền lực, tài sản và sự bảo vệ. Người có Thiên Phủ thủ Mệnh thường thông minh, nhân hậu, có phong thái đường hoàng và cuộc sống ổn định, sung túc.',
      'Nếu Tử Vi là vị vua ra lệnh, Thiên Phủ là vị tể tướng quản lý — điềm tĩnh, chu toàn, biết tính toán và giữ gìn những gì đã có. Đây là sao của sự bền vững hơn là đột phá, thiên về tích lũy và bảo toàn thành quả.'
    ],
    strengths: [
      'Tư duy chu đáo, biết tính toán, quản lý tài chính và công việc bài bản',
      'Nhân hậu, khoan dung, được nhiều người tin tưởng và quý mến',
      'Có phong thái đường hoàng, tạo cảm giác an toàn cho người xung quanh',
      'Kiên định, biết giữ gìn và phát triển bền vững những gì đã gây dựng'
    ],
    weaknesses: [
      'Đôi khi quá thận trọng, ngại mạo hiểm nên bỏ lỡ cơ hội đột phá',
      'Có xu hướng bảo thủ, khó thay đổi thói quen hay quan điểm đã định hình',
      'Coi trọng vẻ ngoài, thể diện, đôi khi tạo áp lực không cần thiết cho bản thân',
      'Nếu thiếu sao tốt phù trợ, dễ chỉ giữ được của cải mà thiếu khí thế bứt phá lớn'
    ],
    career: 'Phù hợp với vai trò quản lý tài chính, hành chính, ngân hàng, hoặc điều hành doanh nghiệp ổn định — nơi cần sự chu toàn, đáng tin cậy hơn là mạo hiểm đổi mới liên tục.',
    love: 'Người Thiên Phủ thủ Mệnh là bạn đời đáng tin cậy, chu toàn và luôn đặt sự ổn định gia đình lên hàng đầu. Nên chủ động tạo thêm sự lãng mạn, bất ngờ để mối quan hệ không trở nên đơn điệu theo thời gian.',
    wealth: 'Đây là một trong những chính tinh có khả năng tích lũy và quản lý tài sản tốt nhất trong 14 sao — tài lộc bền vững, ít biến động lớn, đặc biệt thuận lợi khi ở cung Tài Bạch.',
    health: 'Sức khỏe nhìn chung ổn định, cần chú ý hệ tiêu hóa và cân nặng do lối sống thiên về hưởng thụ, ít vận động mạnh.',
    advice: 'Thiên Phủ thủ Mệnh nên mạnh dạn bước ra khỏi vùng an toàn nhiều hơn — sự thận trọng là điểm mạnh, nhưng đôi khi cần một chút liều lĩnh có tính toán để biến tài sản tích lũy thành những bước tiến lớn.'
  },

  'Thái Âm': {
    label: 'Nguyệt Tinh — Ánh Sáng Dịu Dàng Trong Đêm',
    coreMeaning: [
      'Thái Âm thuộc hành Thủy, tượng trưng cho mặt trăng, chủ về sự tinh tế, cảm xúc, tài sản ẩn (bất động sản, tích lũy) và hình ảnh người mẹ/người vợ. Người có Thái Âm thủ Mệnh thường thông minh, nhạy cảm, tinh tế và có đời sống nội tâm phong phú.',
      'Nếu Thái Dương tỏa sáng ra bên ngoài, Thái Âm lại tích tụ năng lượng vào bên trong — chủ mệnh thiên về chiều sâu, biết quan sát, lắng nghe và thường ra quyết định sau khi đã cân nhắc kỹ lưỡng thay vì bộc phát.'
    ],
    strengths: [
      'Tinh tế, nhạy cảm, có khả năng thấu hiểu cảm xúc người khác',
      'Tư duy sâu sắc, biết lập kế hoạch dài hạn và tích lũy bền bỉ',
      'Có gu thẩm mỹ tốt, phù hợp với các lĩnh vực nghệ thuật, sáng tạo',
      'Ứng xử khéo léo, mềm mỏng, dễ tạo thiện cảm với người xung quanh'
    ],
    weaknesses: [
      'Dễ đa cảm, suy nghĩ nhiều, đôi khi chìm trong cảm xúc tiêu cực',
      'Thiếu quyết đoán trong những tình huống cần hành động nhanh',
      'Dễ phụ thuộc cảm xúc vào người khác, thiếu ranh giới cá nhân rõ ràng',
      'Nếu ở vị trí kém thuận lợi, dễ lận đận về tình cảm gia đình, đặc biệt với người thân là nữ giới'
    ],
    career: 'Phù hợp với các ngành liên quan đến chăm sóc, y tế, giáo dục, nghệ thuật, thẩm mỹ, bất động sản hoặc tài chính — những lĩnh vực cần sự tinh tế và khả năng nhìn xa. Môi trường làm việc nhẹ nhàng, ổn định sẽ giúp phát huy tốt nhất năng lực.',
    love: 'Người Thái Âm thủ Mệnh giàu tình cảm, chu đáo và luôn đặt gia đình lên hàng đầu. Cần học cách bày tỏ nhu cầu bản thân rõ ràng hơn thay vì âm thầm chịu đựng hoặc kỳ vọng đối phương tự hiểu.',
    wealth: 'Tài lộc thường đến từ tích lũy dài hạn, bất động sản hoặc tài sản "ẩn" hơn là thu nhập nổi bật — càng kiên nhẫn tích góp, càng về sau tài chính càng vững vàng.',
    health: 'Cần chú ý sức khỏe tinh thần, hệ nội tiết và các vấn đề liên quan đến chu kỳ, giấc ngủ. Nên duy trì lối sống điều độ, tránh thức khuya vì Thái Âm vốn nhạy cảm với nhịp sinh học.',
    advice: 'Thái Âm thủ Mệnh nên học cách chủ động lên tiếng và ra quyết định dứt khoát hơn — sự tinh tế là tài sản quý, nhưng cần đi cùng sự tự tin để không bị hoàn cảnh hoặc người khác cuốn đi.'
  },

  'Tham Lang': {
    label: 'Đào Hoa Tinh — Ngôi Sao Của Tham Vọng Và Sức Hút',
    coreMeaning: [
      'Tham Lang thuộc hành Mộc, là sao đa năng bậc nhất trong tử vi — vừa chủ về tham vọng, tài năng, vừa chủ về đào hoa, giao tế và ham muốn trải nghiệm. Người có Tham Lang thủ Mệnh linh hoạt, có duyên với đám đông, dễ thích nghi và luôn khao khát khám phá những điều mới mẻ.',
      'Tham Lang không thuộc hẳn về tốt hay xấu mà là sao "trung tính mạnh" — năng lượng dồi dào này có thể trở thành động lực vươn lên phi thường, hoặc dễ sa vào hưởng thụ, dục vọng nếu thiếu sự tiết chế.'
    ],
    strengths: [
      'Đa tài, linh hoạt, dễ thành công ở nhiều lĩnh vực khác nhau',
      'Khéo giao tiếp, có sức hút cá nhân và duyên với đám đông',
      'Nhạy bén với cơ hội, thích nghi nhanh với môi trường mới',
      'Có tham vọng lớn, luôn tìm cách vươn lên vị trí cao hơn'
    ],
    weaknesses: [
      'Dễ tham lam, ôm đồm nhiều mục tiêu cùng lúc dẫn đến thiếu tập trung',
      'Đào hoa mạnh, dễ vướng vào các mối quan hệ tình cảm phức tạp',
      'Ham hưởng thụ, dễ sa vào các thú vui tiêu khiển thiếu lành mạnh nếu không tiết chế',
      'Tính cách thay đổi thất thường, hôm nay nhiệt huyết nhưng dễ chán nản khi gặp khó'
    ],
    career: 'Phù hợp với kinh doanh, ngoại giao, truyền thông, giải trí, nghệ thuật — những lĩnh vực cần sự linh hoạt, sáng tạo và khả năng giao tiếp rộng. Càng đa dạng hóa kỹ năng, Tham Lang càng dễ tỏa sáng.',
    love: 'Đường tình duyên của Tham Lang thủ Mệnh thường sôi nổi, nhiều trải nghiệm nhưng cũng dễ thiếu chung thủy nếu không rèn luyện sự tiết chế. Hôn nhân bền vững cần cả hai cùng xây dựng lòng tin vững chắc theo thời gian.',
    wealth: 'Tài lộc thường đến từ nhiều nguồn khác nhau nhờ sự đa tài — càng mở rộng mối quan hệ và lĩnh vực hoạt động, cơ hội tài chính càng nhiều. Cần tránh chi tiêu theo cảm hứng, hưởng thụ vượt quá khả năng.',
    health: 'Cần chú ý gan, thận và các vấn đề liên quan đến lối sống hưởng thụ (ăn uống, tiệc tùng). Nên xây dựng kỷ luật sinh hoạt để cân bằng với năng lượng dồi dào vốn có.',
    advice: 'Tham Lang thủ Mệnh thành công nhất khi biết chọn MỘT mục tiêu để dồn hết tham vọng vào đó thay vì dàn trải — tài năng đa dạng chỉ thực sự tỏa sáng khi có kỷ luật đi kèm.'
  },

  'Cự Môn': {
    label: 'Ám Tinh — Ngôi Sao Của Khẩu Tài',
    coreMeaning: [
      'Cự Môn thuộc hành Thủy, thuộc chòm Bắc Đẩu, được mệnh danh là "Khẩu Thiệt Tinh" — chủ về tài ăn nói, hùng biện, khả năng phân tích và tranh luận sắc bén. Người có Cự Môn thủ Mệnh thường thông minh, lý luận giỏi, có chính kiến rõ ràng và ít khi chịu khuất phục trước áp lực.',
      'Mặt trái của tài ăn nói là dễ vướng thị phi — Cự Môn còn được gọi là "Ám Tinh" vì bản chất hay đa nghi, dễ nói thẳng làm mất lòng, hoặc bị hiểu lầm ý tốt thành lời khó nghe nếu không khéo léo tiết chế.'
    ],
    strengths: [
      'Tài hùng biện, lý luận sắc bén, có khả năng thuyết phục người khác',
      'Tư duy phân tích tốt, nhìn nhận vấn đề đa chiều, sâu sắc',
      'Có chính kiến riêng, không dễ bị tác động hay lung lay lập trường',
      'Kiên trì, chăm chỉ, sẵn sàng nỗ lực bền bỉ để đạt mục tiêu'
    ],
    weaknesses: [
      'Dễ vướng thị phi, tranh cãi do lời nói thẳng thắn quá mức',
      'Đa nghi, khó tin tưởng tuyệt đối vào ai kể cả người thân cận',
      'Đôi khi bi quan, hay phàn nàn khiến không khí xung quanh nặng nề',
      'Nếu ở vị trí kém thuận lợi, dễ gặp khẩu nghiệp, kiện tụng hoặc mất lòng nơi công sở'
    ],
    career: 'Rất phù hợp với các nghề cần đến khả năng ngôn ngữ như luật sư, giáo viên, MC, ngoại giao, tư vấn, bán hàng, truyền thông. Thành công thường đến khi biết dùng tài ăn nói để thuyết phục thay vì tranh cãi.',
    love: 'Người Cự Môn thủ Mệnh cần đặc biệt cẩn trọng lời nói trong tình cảm — góp ý thẳng thắn dễ bị hiểu thành chỉ trích. Nên học cách diễn đạt mềm mỏng hơn để tránh những hiểu lầm không đáng có với người thân yêu.',
    wealth: 'Tài lộc gắn liền với năng lực chuyên môn và khả năng thuyết phục — càng giỏi trình bày, đàm phán, cơ hội tài chính càng rộng mở, đặc biệt trong các nghề tư vấn, môi giới.',
    health: 'Cần chú ý dạ dày, hệ tiêu hóa (liên quan đến "cái miệng" và thói quen ăn uống, lo nghĩ) cùng sức khỏe tinh thần do hay suy nghĩ, đa nghi.',
    advice: 'Cự Môn thủ Mệnh nên rèn luyện chữ "Tín" và sự cẩn trọng trong lời nói — tài ăn nói là vũ khí sắc bén, dùng để xây dựng lòng tin sẽ mang lại thành công bền vững hơn nhiều so với việc chỉ để tranh hơn thua.'
  },

  'Thiên Tướng': {
    label: 'Ấn Tinh — Vị Tướng Trung Thành',
    coreMeaning: [
      'Thiên Tướng thuộc hành Thủy, đứng ở vị trí thứ năm trong vòng Thiên Phủ, chủ về cơm áo, chức vị và quan lộc. Người có Thiên Tướng thủ Mệnh thường ôn hòa, khéo léo, giàu lòng bao dung và có tinh thần trách nhiệm cao — tựa như vị tướng trung thành, tận tụy phò tá.',
      'Đặc điểm nổi bật của Thiên Tướng là sự đáng tin cậy — chủ mệnh thường được giao phó trọng trách vì tính cẩn trọng, biết giữ lời hứa, và có khả năng dung hòa các mối quan hệ xung quanh mình.'
    ],
    strengths: [
      'Điềm đạm, đáng tin cậy, dễ được cấp trên và đồng nghiệp tín nhiệm',
      'Khéo léo trong ứng xử, biết dung hòa các mối quan hệ phức tạp',
      'Có tinh thần trách nhiệm cao, làm việc gì cũng chỉn chu, tận tâm',
      'Nhân hậu, sẵn sàng giúp đỡ, che chở cho người yếu thế hơn'
    ],
    weaknesses: [
      'Đôi khi thiếu chủ kiến riêng, dễ bị ảnh hưởng bởi ý kiến người khác',
      'Ôm đồm trách nhiệm quá mức, quên chăm lo nhu cầu của chính mình',
      'Ngại xung đột nên đôi khi né tránh những quyết định cần sự cứng rắn',
      'Nếu thiếu sao tốt phù trợ, dễ chỉ đóng vai trò hỗ trợ mà khó vươn lên vị trí cao nhất'
    ],
    career: 'Phù hợp với vai trò quản lý cấp trung, trợ lý điều hành, hành chính, dịch vụ công — những vị trí cần sự tận tâm và khả năng phối hợp nhiều bên. Phát huy tốt nhất khi làm việc bên cạnh người lãnh đạo giỏi.',
    love: 'Người Thiên Tướng thủ Mệnh là bạn đời tận tụy, chu đáo, luôn đặt hạnh phúc gia đình lên hàng đầu. Cần học cách bày tỏ chính kiến và nhu cầu cá nhân rõ ràng hơn thay vì luôn nhường nhịn.',
    wealth: 'Tài lộc ổn định, đến từ vị trí công việc và sự tín nhiệm tích lũy theo thời gian hơn là đột biến. Phù hợp với chiến lược tích lũy bền vững, tránh đầu tư mạo hiểm.',
    health: 'Sức khỏe nhìn chung ổn định nếu biết cân bằng giữa trách nhiệm với người khác và nghỉ ngơi cho bản thân; cần chú ý hệ thận – tiết niệu (liên quan hành Thủy).',
    advice: 'Thiên Tướng thủ Mệnh nên mạnh dạn thể hiện chính kiến và giá trị bản thân nhiều hơn — sự tận tụy chỉ thực sự được ghi nhận xứng đáng khi đi cùng sự tự tin khẳng định vai trò của mình.'
  },

  'Thiên Lương': {
    label: 'Ấm Tinh — Ngôi Sao Của Sự Che Chở',
    coreMeaning: [
      'Thiên Lương thuộc hành Mộc, là Phúc Tinh chủ về trường thọ, phúc đức và khả năng hóa giải tai ương. Người có Thiên Lương thủ Mệnh vốn mang bản tính lương thiện, bao dung, được mệnh danh là "Ấm Tinh" — luôn sẵn sàng che chở, giúp đỡ người khác như một bậc huynh trưởng.',
      'Thiên Lương là sao của người "gánh vác" — chủ mệnh thường được người khác tìm đến khi gặp khó khăn, tin tưởng giao phó những việc cần sự công tâm, chính trực. Đây là phẩm chất quý nhưng cũng dễ khiến chủ mệnh gánh trách nhiệm nhiều hơn phần mình đáng có.'
    ],
    strengths: [
      'Nhân hậu, bao dung, luôn sẵn lòng giúp đỡ người gặp khó khăn',
      'Chính trực, công tâm, được nhiều người tin tưởng nhờ vào phẩm chất đạo đức',
      'Khôn khéo, tinh tế trong xử lý các tình huống nhạy cảm',
      'Có khả năng hóa giải mâu thuẫn, mang lại cảm giác an toàn cho người xung quanh'
    ],
    weaknesses: [
      'Đôi khi quá lo cho người khác mà quên chăm sóc bản thân và gia đình riêng',
      'Dễ có tư tưởng "bề trên", thích chỉ bảo khiến người khác đôi khi khó chịu',
      'Ở vị trí kém thuận lợi, dễ lận đận công danh hoặc phải xa quê lập nghiệp',
      'Đôi khi quá nguyên tắc đạo đức khiến bản thân chịu thiệt trong các mối quan hệ thực dụng'
    ],
    career: 'Rất hợp với các nghề mang tính phụng sự như giáo dục, y tế, luật, thanh tra, công tác từ thiện — nơi phẩm chất công tâm và tinh thần trách nhiệm được phát huy tối đa. Thành công bền vững hơn là đột phá nhanh.',
    love: 'Người Thiên Lương thủ Mệnh là chỗ dựa vững chắc và đáng tin cậy cho bạn đời, nhưng cần tránh xu hướng áp đặt chuẩn mực đạo đức của mình lên đối phương. Hạnh phúc bền lâu khi biết lắng nghe nhiều hơn thay vì chỉ dạy bảo.',
    wealth: 'Tài lộc thường không đến ồ ạt mà tích lũy dần qua uy tín và phúc đức — sống chính trực, giúp người sẽ gián tiếp mở ra nhiều cơ hội tài chính về lâu dài.',
    health: 'Nhìn chung có sức khỏe và tuổi thọ tốt nhờ Phúc Tinh chiếu mệnh; cần chú ý gan, hệ thần kinh do đôi khi ôm đồm quá nhiều lo toan cho người khác.',
    advice: 'Thiên Lương thủ Mệnh nên học cách đặt ranh giới rõ ràng giữa việc giúp đỡ người khác và chăm lo cho bản thân, gia đình riêng — phúc đức bền vững nhất khi bắt đầu từ sự cân bằng ngay trong chính tổ ấm của mình.'
  },

  'Thất Sát': {
    label: 'Tướng Tinh — Chiến Binh Quả Cảm',
    coreMeaning: [
      'Thất Sát thuộc hành Kim, thuộc chòm Nam Đẩu, là sao biểu tượng cho quyền uy, sự quyết đoán và tinh thần tiên phong dám đương đầu thử thách. Người có Thất Sát thủ Mệnh có khí chất mạnh mẽ, quyết đoán, phản xạ nhanh và mang tinh thần chiến binh — càng khó khăn càng muốn chinh phục.',
      'Thất Sát là sao của "được ăn cả, ngã về không" — cuộc đời chủ mệnh thường có những bước ngoặt lớn, thăng trầm rõ rệt hơn người thường, vì bản tính không ngại rủi ro để đạt được mục tiêu lớn.'
    ],
    strengths: [
      'Quyết đoán, dám nghĩ dám làm, không ngại đối mặt với thử thách lớn',
      'Ý chí sắt đá, khả năng chịu áp lực và phục hồi sau thất bại rất tốt',
      'Có tố chất lãnh đạo trong hoàn cảnh khó khăn, khủng hoảng',
      'Thẳng thắn, ghét sự giả tạo, sống thật với cảm xúc của mình'
    ],
    weaknesses: [
      'Nóng tính, hành động đôi khi thiếu cân nhắc kỹ lưỡng',
      'Cá tính mạnh dễ gây va chạm, xung đột với người xung quanh',
      'Cuộc đời dễ trải qua những biến động, thăng trầm lớn nếu gặp sát tinh',
      'Đôi khi quá tự tin vào bản thân, khó chấp nhận thất bại hay lời khuyên'
    ],
    career: 'Phù hợp với môi trường cạnh tranh cao, đòi hỏi bản lĩnh như kinh doanh, khởi nghiệp, quân đội, thể thao chuyên nghiệp — nơi tinh thần chiến đấu của Thất Sát được phát huy tối đa thay vì môi trường công sở đều đặn.',
    love: 'Tình cảm của Thất Sát thủ Mệnh thường mãnh liệt, thẳng thắn nhưng cũng dễ va chạm do cá tính mạnh của cả hai phía. Cần học cách mềm mỏng, lắng nghe để tránh những đổ vỡ không đáng có.',
    wealth: 'Tài chính thường biến động theo chu kỳ "lên voi xuống chó" hơn là ổn định đều đặn — càng dám chấp nhận rủi ro có tính toán, cơ hội bứt phá tài chính càng lớn, nhưng cần có kế hoạch dự phòng.',
    health: 'Cần chú ý chấn thương, tai nạn do tính cách hiếu động, liều lĩnh; cũng nên lưu ý về gan, phổi (liên quan hành Kim) và kiểm soát cơn nóng giận để tránh ảnh hưởng tim mạch.',
    advice: 'Thất Sát thủ Mệnh thành công bền vững nhất khi biết kết hợp lòng dũng cảm với sự tính toán cẩn trọng — sức mạnh chỉ thực sự tạo ra giá trị lâu dài khi được dẫn dắt bởi một chiến lược rõ ràng, không chỉ hành động theo bản năng.'
  },

  'Phá Quân': {
    label: 'Hao Tinh — Ngôi Sao Của Sự Đổi Mới',
    coreMeaning: [
      'Phá Quân thuộc hành Thủy, đứng thứ bảy trong chòm Bắc Đẩu, là sao chủ về sự phá cũ lập mới, biến động và tinh thần cách mạng. Người có Phá Quân thủ Mệnh có cá tính mạnh mẽ, thẳng thắn, cương trực, dám nghĩ dám làm và không ngại thay đổi để tìm hướng đi mới.',
      'Phá Quân là sao của "phá để xây" — cuộc đời chủ mệnh thường không đi theo lối mòn, sẵn sàng đập bỏ những gì cũ kỹ, an toàn để kiến tạo điều mới mẻ hơn, dù phải trả giá bằng sự bất ổn trong giai đoạn chuyển đổi.'
    ],
    strengths: [
      'Sáng tạo, có tinh thần đổi mới, không ngại phá bỏ lối mòn cũ',
      'Dũng cảm, dám chấp nhận rủi ro để theo đuổi hướng đi riêng',
      'Đa tài, có khả năng đảm nhận nhiều vai trò, lĩnh vực khác nhau',
      'Ý chí mạnh mẽ, kiên cường vượt qua nghịch cảnh để làm lại từ đầu'
    ],
    weaknesses: [
      'Hành động đôi khi bộp chộp, thiếu thận trọng dẫn đến rủi ro không đáng có',
      'Sự nghiệp và cuộc sống dễ có nhiều biến động, thay đổi liên tục',
      'Dễ hao tán tiền bạc, công sức vào những quyết định nóng vội',
      'Tính cách mạnh dễ gây xung đột trong các mối quan hệ gia đình, hôn nhân'
    ],
    career: 'Phù hợp với các lĩnh vực cần đến sự đổi mới, khởi nghiệp, sáng tạo, cải cách — nơi tư duy phá cách được coi trọng. Nên tránh môi trường quá khuôn khổ, cứng nhắc vì dễ gây bức bối, phản kháng.',
    love: 'Đường tình cảm của Phá Quân thủ Mệnh thường không bằng phẳng, dễ trải qua đổ vỡ trước khi tìm được sự ổn định thực sự. Cần học cách kiên nhẫn, suy nghĩ thấu đáo trước những quyết định lớn liên quan đến hôn nhân, gia đình.',
    wealth: 'Tài chính thường biến động mạnh — có thể gây dựng sự nghiệp từ con số không nhưng cũng dễ hao tán nếu không có kỷ luật chi tiêu. Nên có quỹ dự phòng vững chắc trước khi mạo hiểm đầu tư lớn.',
    health: 'Cần chú ý chấn thương do lối sống năng động, liều lĩnh; cũng nên lưu ý hệ thận – tiết niệu (hành Thủy) và giữ tinh thần ổn định để tránh những quyết định nóng vội ảnh hưởng sức khỏe lâu dài.',
    advice: 'Phá Quân thủ Mệnh nên dành thời gian suy xét kỹ trước khi hành động, đặc biệt với các quyết định lớn — tinh thần đổi mới là tài sản quý giá, nhưng cần đi cùng sự kiên nhẫn để biến "phá" thành "xây" một cách bền vững.'
  },

  'Vô Chính Diệu': {
    label: 'Mệnh Vô Chính Diệu — Tiềm Năng Ẩn Giấu',
    coreMeaning: [
      'Vô Chính Diệu là cách cục đặc biệt khi cung Mệnh không có chính tinh nào tọa thủ — như một căn nhà chưa có chủ rõ ràng, phải mượn ảnh hưởng từ các sao ở cung xung chiếu (Thiên Di) và các phụ tinh, sao chiếu hợp xung quanh để định hình tính cách, vận mệnh.',
      'Đây không phải là cách cục xấu như nhiều người lầm tưởng — người Vô Chính Diệu thường có tiềm năng lớn, đa tài nhưng cuộc đời nhiều biến động, đặc biệt vất vả hơn ở giai đoạn đầu đời trước khi tự định hình được con đường riêng, thường "đại khí muộn thành" — thành công đến muộn nhưng bền vững nếu biết kiên trì.'
    ],
    strengths: [
      'Khả năng thích nghi cao, linh hoạt xoay chuyển trước hoàn cảnh',
      'Tiềm năng đa dạng, không bị đóng khung vào một khuôn mẫu tính cách cố định',
      'Ý chí tự lập mạnh mẽ, thường tự mình xây dựng con đường riêng từ sớm',
      'Nếu gặp được Tuần, Triệt hoặc các sao giải tốt, dễ có những bước ngoặt bứt phá bất ngờ'
    ],
    weaknesses: [
      'Tuổi trẻ thường vất vả, thiếu điểm tựa ổn định về vật chất lẫn tinh thần',
      'Tính cách và định hướng cuộc đời có thể thay đổi nhiều lần trước khi ổn định',
      'Dễ cảm thấy mông lung, thiếu bản sắc rõ ràng nếu không có sao tốt phù trợ',
      'Cuộc sống nhìn chung nhiều biến động hơn người có chính tinh miếu vượng tại Mệnh'
    ],
    career: 'Nên chọn con đường sự nghiệp cho phép thử nghiệm và điều chỉnh linh hoạt thay vì gắn chặt vào một khuôn mẫu cố định ngay từ đầu — càng trải nghiệm nhiều lĩnh vực, càng dễ tìm ra thế mạnh thực sự phù hợp với bản thân.',
    love: 'Tình duyên của người Vô Chính Diệu thường trải qua nhiều thử thách, thay đổi trước khi tìm được bến đỗ phù hợp. Kiên nhẫn và không vội vàng trong các quyết định tình cảm sẽ giúp tránh những đổ vỡ không đáng có ở giai đoạn đầu đời.',
    wealth: 'Tài lộc thường không ổn định ở giai đoạn trẻ, dễ biến động lên xuống, nhưng có xu hướng cải thiện rõ rệt và bền vững hơn khi bước qua tuổi trung niên nếu kiên trì tích lũy kinh nghiệm và các mối quan hệ.',
    health: 'Cần đặc biệt chú ý sức khỏe ở giai đoạn thơ ấu và thanh niên — nên xây dựng lối sống điều độ sớm để tạo nền tảng thể chất vững chắc cho những giai đoạn biến động sau này.',
    advice: 'Người Vô Chính Diệu không nên nản lòng trước những khó khăn ban đầu — đây là cách cục "đại khí muộn thành", càng kiên trì định hình bản sắc riêng qua trải nghiệm, thành công về sau càng vững chắc và ý nghĩa hơn người có sẵn con đường định hình từ đầu.'
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TUVI_STAR_CONTENT };
}
