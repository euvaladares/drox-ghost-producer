const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Fonts
html = html.replace(
  '<!-- Fonts: Syne, Space Grotesk, JetBrains Mono -->',
  '<!-- Fonts: Outfit, Inter, JetBrains Mono -->'
);
html = html.replace(
  '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />',
  '<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet" />'
);

// Title
html = html.replace(
  '<title>DROX — Ghost Production &amp; Produção Musical | Estúdio Confidencial</title>',
  '<title>DROX — Ghost Production &amp; Produção Musical</title>'
);

// Remove "STUDIO" from brand logo
html = html.replace(/<span class="brand-sub">STUDIO<\/span>/g, '');

// Remove desktop nav
const navRegex = /<nav class="desktop-nav" aria-label="Navegação principal">[\s\S]*?<\/nav>/;
html = html.replace(navRegex, '');

// Remove mobile drawer toggle and drawer entirely
const headerActionsRegex = /<button type="button" class="mobile-menu-btn"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>\s*<!-- Mobile Drawer Navigation -->\s*<div class="mobile-drawer"[\s\S]*?<\/header>/;
html = html.replace(headerActionsRegex, '</div>\n    </div>\n  </header>');

// Update Hero Kicker
html = html.replace('GHOST PRODUCTION &amp; MUSIC STUDIO', 'GHOST PRODUCTION &amp; PRODUÇÃO MUSICAL');

// Update Hero Headline
html = html.replace('O DROX TRANSFORMA EM MÚSICA.', 'EU TRANSFORMO EM MÚSICA.');

// Update Hero Secondary CTA
html = html.replace(
  '<a href="#servicos" class="btn btn-ghost btn-lg" id="hero-secondary-cta">\n              <span>VER TRABALHOS &amp; SERVIÇOS</span>',
  '<a href="#spotify-embed" class="btn btn-ghost btn-lg" id="hero-secondary-cta">\n              <span>OUVIR TRABALHOS</span>'
);

// Update Pillar 1
html = html.replace(
  '<strong>100% Confidencial:</strong> Você cuida do artista. O DROX cuida da produção.',
  '<strong>100% Confidencial:</strong> Você foca em ser o artista. Eu cuido da sua produção.'
);

// Update Spec Code
html = html.replace('STUDIO SPEC // HOUSE &amp; TECH', 'PRODUCER SPEC // HOUSE &amp; TECH');

// Replace Services Section with Spotify Embed
const servicesRegex = /<!-- ==========================================\s*02 — SERVIÇO SECTION\s*========================================== -->[\s\S]*?<\/section>/;
const spotifyEmbed = `<!-- ==========================================
         02 — SPOTIFY & TRABALHOS
         ========================================== -->
    <section class="spotify-section section-padding" id="spotify-embed">
      <div class="container">
        <div class="section-header">
          <div class="kicker-badge">
            <span class="kicker-dot"></span>
            <span class="kicker-mono">01 // MEU TRABALHO</span>
          </div>
          <h2 class="section-title">
            Ouça as produções
          </h2>
          <p class="section-subtitle">
            Um pouco da sonoridade que desenvolvo no estúdio para as pistas.
          </p>
        </div>
        <div class="spotify-embed-container">
          <iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/artist/3a3M4H4TiV5h1DxkETmhTs?utm_source=generator&si=6f7f6d52d8db4524" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
      </div>
    </section>`;
html = html.replace(servicesRegex, spotifyEmbed);

// Update Kicker Numberings
html = html.replace('03 // PROCESSO TRANSPARENTE', '02 // PROCESSO TRANSPARENTE');
html = html.replace('04 // QUEM PRODUZ', '03 // QUEM PRODUZ');
html = html.replace('05 // INICIE SEU PROJETO', '04 // INICIE SEU PROJETO');

// Update Process text
html = html.replace(
  'DROX desenvolve, produz ou refina a track no estúdio. Enviamos uma versão demo para você ouvir e validar a direção musical.',
  'Eu desenvolvo, produzo ou refino a track. Envio uma versão demo para você ouvir e validar a direção musical.'
);
html = html.replace(
  'Garantimos que os graves, transientes e dinâmicas respondam com perfeição em qualquer sound system.',
  'Garanto que os graves, transientes e dinâmicas respondam com perfeição em qualquer sound system.'
);
html = html.replace(
  'Discuta seu projeto diretamente com o DROX sem intermediários.',
  'Discuta seu projeto diretamente comigo, sem intermediários.'
);
html = html.replace(
  '<span>FALAR COM O DROX</span>',
  '<span>FALAR COMIGO</span>'
);

// Update Authority Section text
html = html.replace(
  'DROX é DJ e produtor de Brasília',
  'Sou DJ e produtor natural de Brasília'
);

// Update Footer text
html = html.replace(
  '<span>FALAR COM O DROX</span>',
  '<span>FALAR COMIGO</span>'
);

const footerLinksRegex = /<ul class="footer-links-list">[\s\S]*?<\/ul>/;
const newFooterLinks = `<ul class="footer-links-list">
          <li><a href="#spotify-embed">Ouça os Trabalhos</a></li>
          <li><a href="#como-funciona">Como Funciona</a></li>
          <li><a href="#sobre">Sobre Mim</a></li>
          <li><a href="#contato">Solicitar Orçamento</a></li>
        </ul>`;
html = html.replace(footerLinksRegex, newFooterLinks);

// Modal text updates
html = html.replace('DROX STUDIO // BRIEFING', 'DROX // BRIEFING');

const servicePickerRegex = /<!-- Service Picker Chips -->[\s\S]*?<\/div>\s*<\/div>/;
html = html.replace(servicePickerRegex, '');

fs.writeFileSync('index.html', html);

// 2. Update style.css
let css = fs.readFileSync('src/style.css', 'utf8');

// Update fonts
css = css.replace(/--font-display: 'Syne', sans-serif;/g, "--font-display: 'Outfit', sans-serif;");
css = css.replace(/--font-body: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;/g, "--font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;");

// Remove mobile menu and drawer styles completely
const mobileMenuRegex = /\.mobile-menu-btn[\s\S]*?\.mobile-drawer\s*\{\s*display:\s*none;\s*\}/;
css = css.replace(mobileMenuRegex, '');

// The drawer open state might be further down in media queries. Let's just leave them as they'll be unused.
// Or we can let it be.

// Add Spotify Embed style
css = css + `\n
/* Spotify Embed */
.spotify-embed-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border-radius: 12px;
}
`;

fs.writeFileSync('src/style.css', css);

// 3. Update main.js
let js = fs.readFileSync('src/main.js', 'utf8');

// Remove mobile menu logic
const mobileLogicRegex = /\/\/ Mobile Menu Toggle[\s\S]*?\/\/ --- SMOOTH SCROLLING ---/i;
js = js.replace(mobileLogicRegex, '// --- SMOOTH SCROLLING ---');

// Remove sound showcase logic
const soundLogicRegex = /\/\/ --- AUDIO SHOWCASE LOGIC ---[\s\S]*?\/\/ --- CONTACT FORM \/ MODAL ---/i;
js = js.replace(soundLogicRegex, '// --- CONTACT FORM / MODAL ---');

// Remove service chip auto-selection
const chipLogicRegex = /\/\/ Check for predefined service in data attribute[\s\S]*?\/\/ Handle Form Submission/i;
js = js.replace(chipLogicRegex, '// Handle Form Submission\n');

fs.writeFileSync('src/main.js', js);

console.log('Update script finished successfully.');
