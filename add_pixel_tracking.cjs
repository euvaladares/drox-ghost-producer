const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// The regex will look for '<a href="https://wa.me/5561981107284" target="_blank" class="btn btn-primary...' 
// and append the onclick attribute.
html = html.replace(
  /<a href="https:\/\/wa\.me\/5561981107284" target="_blank" class="(btn btn-primary[^"]*)"/g,
  '<a href="https://wa.me/5561981107284" target="_blank" class="$1" onclick="fbq(\'track\', \'Lead\');"'
);

fs.writeFileSync('index.html', html);
console.log('Added Lead tracking to all WhatsApp buttons.');
