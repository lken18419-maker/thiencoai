/* =============================================
   SEO PAGE GENERATOR (Module 4)
   Sinh ra các trang landing tĩnh /than-so-hoc/so-chu-dao-{N}.html
   (một trang cho mỗi Số Chủ Đạo), trang hub /than-so-hoc/index.html,
   sitemap.xml và robots.txt — dựa trên nội dung đã duyệt trong
   NUMEROLOGY_CONTENT_DETAILED (numerology-engine.js, Module 2).

   Chạy: node generate-seo-pages.js
   Chạy lại bất cứ khi nào NUMEROLOGY_CONTENT_DETAILED thay đổi.

   LƯU Ý: DOMAIN bên dưới là placeholder (chưa có domain thật lúc viết
   script này). Khi có domain thật, đổi biến DOMAIN rồi chạy lại script
   để toàn bộ canonical/OG/sitemap tự cập nhật đồng bộ.
   ============================================= */

const fs = require('fs');
const path = require('path');
const { NUMEROLOGY_CONTENT_DETAILED } = require('./numerology-engine.js');

const DOMAIN = 'https://thiencoai.vn';
const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];
const OUT_DIR = path.join(__dirname, 'than-so-hoc');
const TODAY = new Date().toISOString().slice(0, 10);

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function truncate(s, max) {
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

function navHtml() {
  return `
<!-- ===== NAVBAR ===== -->
<nav class="navbar" id="navbar">
  <div class="nav-inner">
    <a href="../index.html#top" class="nav-logo">
      <img src="../logo.png" alt="Thiên Cơ AI" class="logo-icon">
      <span class="logo-text">Thiên Cơ <span>AI</span></span>
    </a>
    <ul class="nav-links">
      <li><a href="../index.html#top">Trang chủ</a></li>
      <li><a href="../index.html#numerology-section">Thần Số Học</a></li>
      <li><a href="index.html">Ý nghĩa các con số</a></li>
      <li><a href="../index.html#numerology-pricing">Bảng giá</a></li>
      <li><a href="../index.html#faq">FAQ</a></li>
      <li><a href="../index.html#contact">Liên hệ</a></li>
      <li><a href="../index.html#numerology-section" class="nav-cta">Tính miễn phí</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Mở menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="mobile-menu" id="mobileMenu">
    <a href="../index.html#top">Trang chủ</a>
    <a href="../index.html#numerology-section">Thần Số Học</a>
    <a href="index.html">Ý nghĩa các con số</a>
    <a href="../index.html#numerology-pricing">Bảng giá</a>
    <a href="../index.html#faq">FAQ</a>
    <a href="../index.html#contact">Liên hệ</a>
    <a href="../index.html#numerology-section" class="mobile-cta">Tính miễn phí</a>
  </div>
</nav>`;
}

function footerHtml() {
  return `
<!-- ===== FOOTER ===== -->
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="../index.html#top" class="footer-logo">
          <img src="../logo.png" alt="Thiên Cơ AI" class="logo-icon">
          <span>Thiên Cơ AI</span>
        </a>
        <p class="footer-desc">Nền tảng xem tử vi &amp; thần số học bằng trí tuệ nhân tạo, kết hợp tinh hoa mệnh lý cổ truyền với công nghệ hiện đại.</p>
      </div>
      <div class="footer-col">
        <h4>Sản phẩm</h4>
        <ul>
          <li><a href="../index.html#numerology-section">Thần số học miễn phí</a></li>
          <li><a href="../index.html#numerology-pricing">Bảng giá thần số học</a></li>
          <li><a href="../index.html#form-section">Lập lá số tử vi</a></li>
          <li><a href="index.html">Ý nghĩa các con số</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Hỗ trợ</h4>
        <ul>
          <li><a href="../index.html#faq">Câu hỏi thường gặp</a></li>
          <li><a href="../index.html#contact">Liên hệ</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">© 2026 Thiên Cơ AI. Mọi quyền được bảo lưu.</div>
    </div>
  </div>
</footer>
<script>
  document.getElementById('hamburger').addEventListener('click', function () {
    document.getElementById('mobileMenu').classList.toggle('open');
    this.classList.toggle('open');
  });
  document.querySelectorAll('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', function () { document.getElementById('mobileMenu').classList.remove('open'); });
  });
</script>`;
}

function pageHead({ title, description, url, jsonLdBlocks }) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Thiên Cơ AI">
<meta property="og:locale" content="vi_VN">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${DOMAIN}/logo.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${DOMAIN}/logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
<link rel="icon" type="image/png" href="../logo.png">
${jsonLdBlocks.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body>
<div class="stars-bg"></div>`;
}

function breadcrumbHtml(numLabel) {
  return `
<div class="seo-breadcrumb">
  <a href="../index.html#top">Trang chủ</a><span class="sep">/</span>
  <a href="index.html">Thần Số Học</a><span class="sep">/</span>
  <span>${numLabel}</span>
</div>`;
}

function listBlock(title, icon, items, listClass) {
  return `
      <div class="result-block">
        <div class="result-block-title">${icon} ${title}</div>
        <ul class="${listClass}">
          ${items.map(i => `<li>${esc(i)}</li>`).join('\n          ')}
        </ul>
      </div>`;
}

function buildNumberPage(n) {
  const c = NUMEROLOGY_CONTENT_DETAILED[n];
  const numLabel = `Số Chủ Đạo ${n}`;
  const title = `${numLabel} Là Gì? Ý Nghĩa, Điểm Mạnh, Điểm Yếu — ${c.label} | Thiên Cơ AI`;
  const description = truncate(`${numLabel} (${c.label}): ${c.coreMeaning[0]}`, 155);
  const url = `${DOMAIN}/than-so-hoc/so-chu-dao-${n}.html`;

  const faqs = [
    { q: `${numLabel} là gì?`, a: c.coreMeaning[0] },
    { q: `Người mang ${numLabel} có điểm mạnh gì?`, a: c.strengths.join('; ') + '.' },
    { q: `Người mang ${numLabel} hợp nghề nghiệp nào?`, a: c.career },
    { q: `${numLabel} trong tình yêu và hôn nhân thế nào?`, a: c.love }
  ];

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title.replace(' | Thiên Cơ AI', ''),
    description,
    image: `${DOMAIN}/logo.png`,
    author: { '@type': 'Organization', name: 'Thiên Cơ AI' },
    publisher: {
      '@type': 'Organization', name: 'Thiên Cơ AI',
      logo: { '@type': 'ImageObject', url: `${DOMAIN}/logo.png` }
    },
    datePublished: TODAY,
    dateModified: TODAY,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url }
  };
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${DOMAIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Thần Số Học', item: `${DOMAIN}/than-so-hoc/` },
      { '@type': 'ListItem', position: 3, name: numLabel, item: url }
    ]
  };
  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };

  const others = NUMBERS.filter(x => x !== n);

  const html = `${pageHead({ title, description, url, jsonLdBlocks: [jsonLdArticle, jsonLdBreadcrumb, jsonLdFaq] })}
${navHtml()}

${breadcrumbHtml(numLabel)}

<section class="seo-hero">
  <div class="container">
    <div class="seo-number-badge">${n}</div>
    <h1>${numLabel} — <span>${esc(c.label)}</span>: Ý Nghĩa, Điểm Mạnh &amp; Điểm Yếu</h1>
    <p class="seo-lede">Khám phá ý nghĩa đầy đủ của ${numLabel} trong Thần Số Học — điểm mạnh, điểm yếu cụ thể, sự nghiệp, tình duyên, tài chính và cách phát huy tối đa tiềm năng của con số này.</p>
  </div>
</section>

<article class="seo-article-body">
  <h2>${numLabel} Là Gì?</h2>
  ${c.coreMeaning.map(p => `<p>${esc(p)}</p>`).join('\n  ')}

  <h2>Điểm Mạnh Của Người ${numLabel}</h2>
  ${listBlock('Điểm Mạnh', '💪', c.strengths, 'plan-features')}

  <h2>Điểm Yếu Cần Lưu Ý</h2>
  ${listBlock('Điểm Yếu', '⚠️', c.weaknesses, 'weakness-list')}

  <h2>Checklist Cải Thiện Bản Thân</h2>
  ${listBlock('Checklist Cải Thiện', '✅', c.improvementChecklist, 'checklist-list')}

  <h2>Sự Nghiệp Phù Hợp Với ${numLabel}</h2>
  <p>${esc(c.career)}</p>

  <h2>Tình Duyên &amp; Các Mối Quan Hệ</h2>
  <p>${esc(c.love)}</p>

  <h2>Tài Chính &amp; Tiền Bạc</h2>
  <p>${esc(c.finance)}</p>
</article>

<div class="seo-cta-box">
  <p><strong>Đây là ý nghĩa chung của ${numLabel}.</strong> Muốn biết chính xác Số Chủ Đạo của <em>bạn</em>, cùng 6 chỉ số khác, 60 năm cuộc đời và 4 đỉnh cao vận mệnh — hãy tính thần số học miễn phí ngay.</p>
  <a href="../index.html#numerology-section" class="btn btn-primary">🔢 Tính Thần Số Học Miễn Phí Của Tôi</a>
</div>

<section class="seo-faq">
  <h2>Câu Hỏi Thường Gặp Về ${numLabel}</h2>
  ${faqs.map(f => `<div class="seo-faq-item"><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('\n  ')}
</section>

<section class="seo-related">
  <div class="container">
    <h2>Xem Ý Nghĩa Các Số Chủ Đạo Khác</h2>
    <div class="seo-related-grid">
      ${others.map(o => `<a href="so-chu-dao-${o}.html"><span class="rn">${o}</span>${esc(NUMEROLOGY_CONTENT_DETAILED[o].label)}</a>`).join('\n      ')}
    </div>
  </div>
</section>
${footerHtml()}
</body>
</html>
`;

  return html;
}

function buildHubPage() {
  const title = 'Ý Nghĩa Các Con Số Trong Thần Số Học (1-9, 11, 22, 33) | Thiên Cơ AI';
  const description = 'Tra cứu ý nghĩa đầy đủ của từng Số Chủ Đạo trong Thần Số Học — từ số 1 đến 9 và các số Master 11, 22, 33 — điểm mạnh, điểm yếu, sự nghiệp, tình duyên.';
  const url = `${DOMAIN}/than-so-hoc/`;

  const jsonLdCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title.replace(' | Thiên Cơ AI', ''),
    description,
    url,
    hasPart: NUMBERS.map(n => ({
      '@type': 'Article',
      headline: `Số Chủ Đạo ${n} — ${NUMEROLOGY_CONTENT_DETAILED[n].label}`,
      url: `${DOMAIN}/than-so-hoc/so-chu-dao-${n}.html`
    }))
  };
  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: `${DOMAIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Thần Số Học', item: url }
    ]
  };

  const html = `${pageHead({ title, description, url, jsonLdBlocks: [jsonLdCollection, jsonLdBreadcrumb] })}
${navHtml()}

<div class="seo-breadcrumb">
  <a href="../index.html#top">Trang chủ</a><span class="sep">/</span>
  <span>Thần Số Học</span>
</div>

<section class="seo-hero">
  <div class="container">
    <h1>Ý Nghĩa Các <span>Số Chủ Đạo</span> Trong Thần Số Học</h1>
    <p class="seo-lede">Mỗi con số từ 1 đến 9, cùng 3 số Master 11, 22, 33, mang một tính cách, thế mạnh và bài học riêng. Chọn số của bạn bên dưới để xem phân tích đầy đủ, hoặc tính thần số học miễn phí để biết chính xác Số Chủ Đạo của bạn.</p>
  </div>
</section>

<section style="padding: 0 20px 90px;">
  <div class="seo-hub-grid">
    ${NUMBERS.map(n => {
      const c = NUMEROLOGY_CONTENT_DETAILED[n];
      return `<a class="seo-hub-card" href="so-chu-dao-${n}.html">
      <span class="rn">${n}</span>
      <h3>Số Chủ Đạo ${n} — ${esc(c.label)}</h3>
      <p>${esc(truncate(c.coreMeaning[0], 110))}</p>
    </a>`;
    }).join('\n    ')}
  </div>
</section>

<div class="seo-cta-box">
  <p>Chưa biết Số Chủ Đạo của mình là gì? Nhập họ tên và ngày sinh để tính miễn phí chỉ trong vài giây.</p>
  <a href="../index.html#numerology-section" class="btn btn-primary">🔢 Tính Thần Số Học Miễn Phí</a>
</div>
${footerHtml()}
</body>
</html>
`;
  return html;
}

function buildSitemap() {
  const urls = [
    { loc: `${DOMAIN}/`, priority: '1.0' },
    { loc: `${DOMAIN}/than-so-hoc/`, priority: '0.9' },
    ...NUMBERS.map(n => ({ loc: `${DOMAIN}/than-so-hoc/so-chu-dao-${n}.html`, priority: '0.8' }))
  ];
  const body = urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${u.priority}</priority>
  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

function buildRobots() {
  return `User-agent: *
Allow: /
Disallow: /admin.html
Disallow: /payment-result.html

Sitemap: ${DOMAIN}/sitemap.xml
`;
}

// ===== Chạy =====
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const n of NUMBERS) {
  fs.writeFileSync(path.join(OUT_DIR, `so-chu-dao-${n}.html`), buildNumberPage(n), 'utf8');
}
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), buildHubPage(), 'utf8');
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), buildSitemap(), 'utf8');
fs.writeFileSync(path.join(__dirname, 'robots.txt'), buildRobots(), 'utf8');

console.log(`Đã tạo ${NUMBERS.length} trang landing + hub + sitemap.xml + robots.txt trong ${OUT_DIR} (và thư mục gốc).`);
console.log(`LƯU Ý: DOMAIN hiện là placeholder "${DOMAIN}" — đổi trong generate-seo-pages.js và chạy lại khi có domain thật.`);
