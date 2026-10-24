import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COMPARATIFS } from '../src/data/comparatifs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMarkdownBold(text: string): string {
  // Replace **bold** with <strong>bold</strong>
  return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

async function prerender() {
  const distDir = path.resolve(__dirname, '../dist');
  const comparatifDir = path.join(distDir, 'comparatif');

  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  const slugs = Object.keys(COMPARATIFS);
  console.log(`Prerendering ${slugs.length} comparative SEO pages...`);

  for (const slug of slugs) {
    const data = COMPARATIFS[slug];
    const targetDir = path.join(comparatifDir, slug);
    fs.mkdirSync(targetDir, { recursive: true });

    const otherSlugs = slugs.filter((s) => s !== slug);

    // JSON-LD Article
    const jsonLdArticle = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.h1,
      description: data.meta_description,
      datePublished: data.publishedDate,
      dateModified: data.modifiedDate,
      mainEntityOfPage: data.canonical,
      author: {
        '@type': 'Organization',
        name: 'BâtiDevis',
        url: 'https://batidevis.fr',
      },
      publisher: {
        '@type': 'Organization',
        name: 'BâtiDevis',
        logo: {
          '@type': 'ImageObject',
          url: 'https://batidevis.fr/icon.svg',
        },
      },
    };

    // JSON-LD FAQPage
    const jsonLdFaq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    };

    // Render Table HTML
    let tableHtml = '';
    if (data.multiActorTableData) {
      tableHtml = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Critère d'analyse</th>
              <th>Quotepro</th>
              <th>Estimapro</th>
              <th>Turbotravaux</th>
              <th class="batidevis-col">BATIDEVIS</th>
            </tr>
          </thead>
          <tbody>
            ${data.multiActorTableData
              .map(
                (row, i) => `
              <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
                <td class="criterion"><strong>${escapeHtml(row.critere)}</strong></td>
                <td>${escapeHtml(row.quotepro)}</td>
                <td>${escapeHtml(row.estimapro)}</td>
                <td>${escapeHtml(row.turbotravaux)}</td>
                <td class="batidevis-cell">${escapeHtml(row.batidevis)}</td>
              </tr>`
              )
              .join('\n')}
          </tbody>
        </table>
      </div>`;
    } else {
      tableHtml = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Critère métier</th>
              <th>${escapeHtml(data.concurrentName)}</th>
              <th class="batidevis-col">BATIDEVIS</th>
            </tr>
          </thead>
          <tbody>
            ${data.tableData
              .map(
                (row, i) => `
              <tr class="${i % 2 === 0 ? 'even' : 'odd'}">
                <td class="criterion"><strong>${escapeHtml(row.critere)}</strong></td>
                <td>${escapeHtml(row.concurrent)}</td>
                <td class="batidevis-cell">${escapeHtml(row.batidevis)}</td>
              </tr>`
              )
              .join('\n')}
          </tbody>
        </table>
      </div>`;
    }

    // Render Editorial Sections
    const sectionsHtml = data.sections
      .map((sec, idx) => {
        const paragraphs = sec.content
          .map((p) => `<p>${formatMarkdownBold(p)}</p>`)
          .join('\n');
        const showTable = idx === 2 ? tableHtml : '';
        return `
        <section class="editorial-section">
          <h2><span class="sec-num">0${idx + 1}.</span> ${escapeHtml(sec.h2)}</h2>
          <div class="sec-body">
            ${paragraphs}
          </div>
          ${showTable}
        </section>`;
      })
      .join('\n');

    // Render FAQ HTML
    const faqHtml =
      data.faq.length > 0
        ? `
      <section class="faq-section">
        <h2>Questions fréquentes sur ce comparatif</h2>
        <div class="faq-list">
          ${data.faq
            .map(
              (item) => `
            <div class="faq-card">
              <h3>${escapeHtml(item.question)}</h3>
              <p>${escapeHtml(item.answer)}</p>
            </div>`
            )
            .join('\n')}
        </div>
      </section>`
        : '';

    // Render Other Comparatifs Links
    const otherLinksHtml = otherSlugs
      .map((otherSlug) => {
        const other = COMPARATIFS[otherSlug];
        return `
        <a href="/comparatif/${otherSlug}" class="other-card">
          <span class="other-vs">vs ${escapeHtml(other.concurrentName)}</span>
          <span class="other-title">${escapeHtml(other.title)}</span>
          <span class="other-action">Lire le comparatif &rarr;</span>
        </a>`;
      })
      .join('\n');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(data.title)} | BâtiDevis</title>
  <meta name="description" content="${escapeHtml(data.meta_description)}" />
  <meta name="keywords" content="${escapeHtml(data.mots_cles.join(', '))}" />
  <link rel="canonical" href="${data.canonical}" />

  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(data.title)}" />
  <meta property="og:description" content="${escapeHtml(data.meta_description)}" />
  <meta property="og:url" content="${data.canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="BâtiDevis" />
  <meta property="og:locale" content="fr_FR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(data.title)}" />
  <meta name="twitter:description" content="${escapeHtml(data.meta_description)}" />

  <!-- Google Fonts Preconnect -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(jsonLdArticle, null, 2)}
  </script>
  <script type="application/ld+json">
${JSON.stringify(jsonLdFaq, null, 2)}
  </script>

  <style>
    :root {
      --bg: #ffffff;
      --text: #0f172a;
      --text-muted: #475569;
      --blue-primary: #2563eb;
      --blue-dark: #1d4ed8;
      --blue-light: #eff6ff;
      --border: #e2e8f0;
      --card-bg: #f8fafc;
      --dark-card: #090d16;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.65;
      font-size: 16px;
    }
    a { color: var(--blue-primary); text-decoration: none; }
    a:hover { text-decoration: underline; }
    h1, h2, h3 { font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; font-weight: 800; line-height: 1.25; }
    
    .nav-bar {
      border-bottom: 1px solid var(--border);
      background: rgba(248, 250, 252, 0.95);
      position: sticky;
      top: 0;
      z-index: 20;
      padding: 12px 20px;
    }
    .nav-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
    }
    .breadcrumb { display: flex; align-items: center; gap: 8px; color: var(--text-muted); }
    .breadcrumb a { font-weight: 600; color: var(--text-muted); }
    .breadcrumb a:hover { color: var(--blue-primary); text-decoration: none; }
    .nav-cta {
      background: var(--blue-primary);
      color: #fff !important;
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
    }
    .nav-cta:hover { background: var(--blue-dark); text-decoration: none; }

    .hero-header {
      background: linear-gradient(180deg, #090d16 0%, #0f172a 100%);
      color: #ffffff;
      padding: 64px 20px 48px;
      text-align: center;
    }
    .hero-container { max-width: 860px; margin: 0 auto; }
    .hero-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(37, 99, 235, 0.2);
      color: #60a5fa;
      padding: 4px 12px;
      border-radius: 9999px;
      border: 1px solid rgba(59, 130, 246, 0.4);
      margin-bottom: 18px;
    }
    .hero-header h1 { font-size: clamp(26px, 4vw, 42px); margin-bottom: 18px; }
    .hero-intro { font-size: clamp(15px, 2vw, 18px); color: #cbd5e1; max-width: 760px; margin: 0 auto 20px; }
    .tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
    .tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      background: rgba(30, 41, 59, 0.8);
      color: #94a3b8;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #334155;
    }

    .main-content { max-width: 860px; margin: 0 auto; padding: 48px 20px; }
    .editorial-section { margin-bottom: 48px; }
    .editorial-section h2 {
      font-size: clamp(20px, 3vw, 26px);
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }
    .sec-num { color: var(--blue-primary); font-family: 'JetBrains Mono', monospace; }
    .sec-body p { margin-bottom: 14px; color: #334155; line-height: 1.7; }

    .table-wrapper {
      margin: 28px 0;
      overflow-x: auto;
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
    th {
      background: #f1f5f9;
      padding: 12px 16px;
      font-weight: 700;
      color: #1e293b;
      border-bottom: 1px solid var(--border);
    }
    th.batidevis-col { background: #dbeafe; color: #1e40af; }
    td { padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: top; }
    tr.odd { background: #fafafa; }
    td.batidevis-cell { background: #eff6ff; font-weight: 600; color: #1e3a8a; }
    td.criterion { color: #0f172a; }

    .verdict-box {
      background: var(--dark-card);
      color: #fff;
      border-radius: 18px;
      padding: 32px 28px;
      margin: 48px 0;
      border: 1px solid #1e293b;
    }
    .verdict-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #60a5fa;
      margin-bottom: 16px;
    }
    .verdict-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (min-width: 640px) {
      .verdict-grid { grid-template-columns: 1fr 1fr; }
    }
    .verdict-card {
      background: #0f172a;
      border: 1px solid #1e293b;
      padding: 20px;
      border-radius: 12px;
    }
    .verdict-card.batidevis {
      background: rgba(30, 58, 138, 0.3);
      border-color: rgba(59, 130, 246, 0.4);
    }
    .verdict-card h3 { font-size: 15px; margin-bottom: 8px; color: #ffffff; }
    .verdict-card.batidevis h3 { color: #93c5fd; }
    .verdict-card p { font-size: 13.5px; color: #cbd5e1; line-height: 1.6; }
    .verdict-conclusion {
      border-top: 1px solid #1e293b;
      padding-top: 16px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      color: #e2e8f0;
    }

    .faq-section { margin-top: 48px; }
    .faq-section h2 { font-size: 22px; margin-bottom: 18px; }
    .faq-list { display: flex; flex-direction: column; gap: 12px; }
    .faq-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 18px 20px;
    }
    .faq-card h3 { font-size: 15px; margin-bottom: 6px; color: #0f172a; }
    .faq-card p { font-size: 14px; color: #475569; line-height: 1.6; }

    .other-section {
      margin-top: 48px;
      padding-top: 32px;
      border-top: 1px solid var(--border);
    }
    .other-section h3 {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 16px;
    }
    .other-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 14px;
    }
    .other-card {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #fff;
      transition: all 0.2s;
    }
    .other-card:hover {
      border-color: var(--blue-primary);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
      text-decoration: none;
    }
    .other-vs { font-weight: 800; color: #0f172a; font-size: 14px; margin-bottom: 4px; }
    .other-title { font-size: 12px; color: #64748b; margin-bottom: 12px; line-height: 1.4; }
    .other-action { font-size: 12px; font-weight: 700; color: var(--blue-primary); font-family: 'JetBrains Mono', monospace; }

    .cta-banner {
      background: #f8fafc;
      border-top: 1px solid var(--border);
      padding: 48px 20px;
      text-align: center;
      margin-top: 56px;
    }
    .cta-container { max-width: 680px; margin: 0 auto; }
    .cta-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      background: #dbeafe;
      color: #1e40af;
      padding: 4px 12px;
      border-radius: 9999px;
      margin-bottom: 14px;
    }
    .cta-banner h2 { font-size: clamp(22px, 3.5vw, 30px); margin-bottom: 12px; color: #0f172a; }
    .cta-banner p { font-size: 15px; color: #475569; margin-bottom: 24px; }
    .cta-button {
      display: inline-block;
      background: var(--blue-primary);
      color: #ffffff !important;
      font-weight: 800;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
      transition: all 0.2s;
    }
    .cta-button:hover { background: var(--blue-dark); text-decoration: none; transform: translateY(-1px); }

    .footer {
      border-top: 1px solid var(--border);
      padding: 24px 20px;
      text-align: center;
      font-size: 13px;
      color: #64748b;
    }
  </style>
</head>
<body>
  ${data.todoHumanNotice}

  <!-- Header Navigation -->
  <nav class="nav-bar">
    <div class="nav-container">
      <div class="breadcrumb">
        <a href="/">Accueil</a>
        <span>/</span>
        <a href="/#comparatifs">Comparatifs</a>
        <span>/</span>
        <span>${escapeHtml(data.concurrentName)}</span>
      </div>
      <a href="/#waitlist" class="nav-cta">Tester BATIDEVIS</a>
    </div>
  </nav>

  <!-- Hero Header -->
  <header class="hero-header">
    <div class="hero-container">
      <span class="hero-badge">Comparatif Logiciel Devis Bâtiment 2026</span>
      <h1>${escapeHtml(data.h1)}</h1>
      <p class="hero-intro">${escapeHtml(data.intro)}</p>
      <div class="tags">
        ${data.mots_cles.map((kw) => `<span class="tag">#${escapeHtml(kw)}</span>`).join('\n        ')}
      </div>
    </div>
  </header>

  <!-- Main Editorial Content -->
  <main class="main-content">
    ${sectionsHtml}

    <!-- Verdict Box -->
    <section class="verdict-box">
      <div class="verdict-label">&#9733; Synthèse & Recommandation objective</div>
      <div class="verdict-grid">
        <div class="verdict-card">
          <h3>Quand choisir ${escapeHtml(data.concurrentName)} ?</h3>
          <p>${escapeHtml(data.verdict.pourQuiConcurrent)}</p>
        </div>
        <div class="verdict-card batidevis">
          <h3>Quand choisir BATIDEVIS ?</h3>
          <p>${escapeHtml(data.verdict.pourQuiBatidevis)}</p>
        </div>
      </div>
      <div class="verdict-conclusion">
        &#128161; ${escapeHtml(data.verdict.conclusion)}
      </div>
    </section>

    <!-- FAQ Section -->
    ${faqHtml}

    <!-- Other Comparatifs -->
    <section class="other-section">
      <h3>Autres comparatifs logiciels devis 2026</h3>
      <div class="other-grid">
        ${otherLinksHtml}
      </div>
    </section>
  </main>

  <!-- CTA Section -->
  <section class="cta-banner" id="waitlist">
    <div class="cta-container">
      <span class="cta-badge">Cohorte Fondateurs 2026</span>
      <h2>Testez BATIDEVIS sans engagement sur vos prochains devis</h2>
      <p>19€/mois affiché publiquement, 100% conforme aux 16 mentions obligatoires et utilisable directement sur votre smartphone sur le chantier.</p>
      <a href="/#waitlist" class="cta-button">Rejoindre les 20 artisans fondateurs</a>
    </div>
  </section>

  <footer class="footer">
    <p>&copy; 2026 BâtiDevis - Logiciel devis facture conforme pour artisans du bâtiment.</p>
  </footer>
</body>
</html>`;

    const targetFile = path.join(targetDir, 'index.html');
    fs.writeFileSync(targetFile, html, 'utf8');
    console.log(`Generated: dist/comparatif/${slug}/index.html`);
  }

  // Generate dist/sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://batidevis.fr/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${slugs
  .map(
    (s) => `  <url>
    <loc>https://batidevis.fr/comparatif/${s}</loc>
    <lastmod>${COMPARATIFS[s].modifiedDate.split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  console.log('Generated: dist/sitemap.xml');

  // Generate dist/robots.txt
  const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://batidevis.fr/sitemap.xml
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
  console.log('Generated: dist/robots.txt');

  console.log('Static prerendering completed successfully!');
}

prerender().catch((err) => {
  console.error('Error during prerender:', err);
  process.exit(1);
});
