
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');

// 1. Read the index.html file
let htmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// 2. Find and replace CSS links
const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
for (const cssFile of cssFiles) {
  const cssPath = path.join(assetsDir, cssFile);
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const cssLink = `<link rel="stylesheet" href="./assets/${cssFile}">`;
  htmlContent = htmlContent.replace(cssLink, `<style>${cssContent}</style>`);
}

// 3. Find and replace JS script tags
const jsFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.js'));
for (const jsFile of jsFiles) {
  const jsPath = path.join(assetsDir, jsFile);
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const scriptTag = `<script type="module" crossorigin src="./assets/${jsFile}"></script>`;
  // The closing script tag might be written as <\/script> in the HTML, so we need to handle that
  htmlContent = htmlContent.replace(scriptTag, `<script>${jsContent.replace(/<\/script>/g, '<\\/script>')}</script>`);
}

// 4. Write the new HTML file
fs.writeFileSync(path.join(__dirname, 'AuditViewer_Pro_Offline.html'), htmlContent);

console.log('Successfully created AuditViewer_Pro_Offline.html');
