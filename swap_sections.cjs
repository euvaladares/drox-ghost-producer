const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Regexes for the two sections
const spotifyRegex = /<!-- ==========================================\s*02 — SPOTIFY & TRABALHOS\s*========================================== -->[\s\S]*?<\/section>\s*/;
const processoRegex = /<!-- ==========================================\s*03 — COMO FUNCIONA\s*========================================== -->[\s\S]*?<\/section>\s*/;

const spotifyMatch = html.match(spotifyRegex);
const processoMatch = html.match(processoRegex);

if (spotifyMatch && processoMatch) {
  let spotifySection = spotifyMatch[0];
  let processoSection = processoMatch[0];

  // Remove both sections from the original html
  html = html.replace(spotifySection, '');
  html = html.replace(processoSection, '');

  // Update section numbers
  processoSection = processoSection.replace('02 // PROCESSO TRANSPARENTE', '01 // PROCESSO TRANSPARENTE');
  spotifySection = spotifySection.replace('01 // MEU TRABALHO', '02 // MEU TRABALHO');

  // We need to insert them back after the hero section.
  // The hero section ends at </section> right before the spotify section.
  // We can insert after `<main id="main-content">` and the first `</section>` (which is hero).
  const insertIndex = html.indexOf('</section>', html.indexOf('hero-section')) + '</section>\n\n'.length;
  
  html = html.slice(0, insertIndex) + 
         processoSection + '\n' + 
         spotifySection + '\n' + 
         html.slice(insertIndex);
         
  fs.writeFileSync('index.html', html);
  console.log('Sections swapped successfully.');
} else {
  console.log('Could not find one or both sections.');
}
