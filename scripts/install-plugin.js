const fs = require('fs');
const path = require('path');
const os = require('os');

const homeDir = os.homedir();
const targetDir = path.join(homeDir, '.gemini', 'config', 'plugins', 'viber');
const sourceDir = path.join(__dirname, '..', 'plugin');

console.log(`📦 Installing Viber plugin from: ${sourceDir}`);
console.log(`🎯 Target directory: ${targetDir}`);

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }

  const entries = fs.readdirSync(from, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyFolderSync(sourceDir, targetDir);
  console.log('✅ Viber plugin successfully installed into Antigravity!');
  console.log('💡 Remember to configure your VIBER_AUTH_TOKEN in ~/.gemini/config/plugins/viber/mcp_config.json');
} catch (err) {
  console.error('❌ Installation failed:', err.message);
  process.exit(1);
}
