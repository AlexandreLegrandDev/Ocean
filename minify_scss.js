const fs = require('fs');
let scss = fs.readFileSync('css/style.scss', 'utf8');

// Remove single line comments
scss = scss.replace(/\/\/.*$/gm, '');

// Remove multi-line comments
scss = scss.replace(/\/\*[\s\S]*?\*\//g, '');

// Condense multiple blank lines into a single newline
scss = scss.replace(/\n\s*\n/g, '\n');

// Condense CSS properties inside blocks onto single lines where small
scss = scss.replace(/\{\n\s+([^\{\}]+)\n\s*\}/g, (match, p1) => {
  if (p1.split('\n').length <= 3) {
    return `{ ${p1.replace(/\n\s*/g, ' ')} }`;
  }
  return match;
});

fs.writeFileSync('css/style.scss', scss);
console.log('optimized css/style.scss');
