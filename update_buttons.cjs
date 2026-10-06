const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Header CTA
html = html.replace(
  /<button type="button" class="btn btn-primary btn-sm open-budget-modal" id="header-cta-btn">[\s\S]*?<\/button>/,
  `<a href="https://wa.me/5561981107284" target="_blank" class="btn btn-primary btn-sm">
          <span>FALAR COMIGO</span>
          <svg class="btn-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>`
);

// Hero CTA
html = html.replace(
  /<button type="button" class="btn btn-primary btn-lg open-budget-modal" id="hero-primary-cta">[\s\S]*?<\/button>/,
  `<a href="https://wa.me/5561981107284" target="_blank" class="btn btn-primary btn-lg">
              <span>FALAR COMIGO</span>
              <svg class="btn-arrow" width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>`
);

// Process CTA
html = html.replace(
  /<button type="button" class="btn btn-primary open-budget-modal" id="process-cta-btn">[\s\S]*?<\/button>/,
  `<a href="https://wa.me/5561981107284" target="_blank" class="btn btn-primary">
            <span>FALAR COMIGO</span>
            <svg class="btn-arrow" width="14" height="14" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>`
);

// Final CTA
const finalCTARegex = /<div class="final-cta-buttons">[\s\S]*?<\/div>/;
html = html.replace(finalCTARegex, `<div class="final-cta-buttons">
            <a href="https://wa.me/5561981107284" target="_blank" class="btn btn-primary btn-xl">
              <span>FALAR COMIGO</span>
              <svg class="btn-arrow" width="16" height="16" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </div>`);

// Remove Modal
const modalRegex = /<!-- ==========================================\s*MODAL DE ORÇAMENTO \/ BRIEFING DIRETO\s*========================================== -->[\s\S]*?(?=<!-- FOOTER -->)/;
html = html.replace(modalRegex, '');

fs.writeFileSync('index.html', html);

// 2. Clean up main.js
const smoothScrollOnly = `
// --- SMOOTH SCROLLING ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});
`;
fs.writeFileSync('src/main.js', smoothScrollOnly.trim());

console.log('Update script finished successfully.');
