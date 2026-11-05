const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawnSync } = require('child_process');
const readline = require('readline');

// Color helpers for terminal output
const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;

function ask(question, defaultValue = '') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const promptText = defaultValue ? `${question} (${defaultValue}): ` : `${question}: `;
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

// Helper to execute commands cross-platform
function runCommand(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', ...opts }).trim();
  } catch (err) {
    if (opts.throwOnError !== false) throw err;
    return null;
  }
}

// Recursive directory copy
function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function verifyViberToken(token) {
  try {
    const res = await fetch('https://chatapi.viber.com/pa/get_account_info', {
      method: 'POST',
      headers: {
        'X-Viber-Auth-Token': token,
        'Content-Type': 'application/json',
      },
      body: '{}',
    });
    const data = await res.json();
    if (data.status === 0) return { ok: true, data };
    return { ok: false, error: data.status_message || `Viber error status ${data.status}` };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function main() {
  console.log('\n' + bold(cyan('=====================================================')));
  console.log(bold(cyan(' 🚀 Viber Universal Agent & Webhook Setup Wizard')));
  console.log(bold(cyan('=====================================================\n')));

  // Parse arguments for CLI / Agent automation
  const args = process.argv.slice(2);
  let tokenArg = args.find((a) => a.startsWith('--token='))?.split('=')[1];
  let skipVercel = args.includes('--skip-vercel');

  let token = tokenArg || process.env.VIBER_AUTH_TOKEN;

  // 1. Prompt for Token if not supplied
  if (!token) {
    console.log(bold('Step 1: Viber Authentication'));
    console.log('You can find your token in your Viber Channel/Bot info screen -> Developer Tools.\n');
    token = await ask('🔑 Enter your VIBER_AUTH_TOKEN');
  }

  if (!token) {
    console.error(red('❌ VIBER_AUTH_TOKEN is required. Exiting.'));
    process.exit(1);
  }

  // 2. Verify Token & Auto-detect info
  console.log('\n🔍 Verifying token with Viber API...');
  const verifyResult = await verifyViberToken(token);
  if (!verifyResult.ok) {
    console.error(red(`❌ Invalid token: ${verifyResult.error}`));
    process.exit(1);
  }

  const account = verifyResult.data;
  const botName = account.name || 'MyBot';
  const superadmin = account.members?.find((m) => m.role === 'superadmin') || account.members?.[0];
  const superadminId = superadmin?.id || '';

  console.log(green(`   ✓ Token verified! Account name: "${botName}"`));
  if (superadminId) {
    console.log(green(`   ✓ Superadmin detected: "${superadmin?.name}" (${superadminId})`));
  }

  // 3. Configure Local Files & Antigravity Plugin
  console.log('\n' + bold('Step 2: Installing Local & Antigravity Plugins'));
  const rootDir = path.resolve(__dirname, '..');
  const homeDir = os.homedir();
  const antigravityPluginDir = path.join(homeDir, '.gemini', 'config', 'plugins', 'viber');

  // Write local .env
  const envContent = `PORT=3000\nVIBER_AUTH_TOKEN=${token}\nVIBER_SUPERADMIN_ID=${superadminId}\nVIBER_SENDER_NAME=${botName}\n`;
  fs.writeFileSync(path.join(rootDir, '.env'), envContent);
  console.log(green('   ✓ Updated local .env'));

  // Update .cursor/mcp.json
  const cursorMcpPath = path.join(rootDir, '.cursor', 'mcp.json');
  if (fs.existsSync(cursorMcpPath)) {
    const cursorMcp = JSON.parse(fs.readFileSync(cursorMcpPath, 'utf8'));
    if (cursorMcp.mcpServers?.viber) {
      cursorMcp.mcpServers.viber.env.VIBER_AUTH_TOKEN = token;
      cursorMcp.mcpServers.viber.env.VIBER_SENDER_NAME = botName;
      fs.writeFileSync(cursorMcpPath, JSON.stringify(cursorMcp, null, 2));
      console.log(green('   ✓ Updated .cursor/mcp.json for Cursor'));
    }
  }

  // Install to Antigravity global plugins directory
  copyFolderSync(path.join(rootDir, 'plugin'), antigravityPluginDir);
  const mcpConfigPath = path.join(antigravityPluginDir, 'mcp_config.json');
  const mcpConfig = {
    mcpServers: {
      viber: {
        command: 'npx',
        args: ['-y', '@serhii.zghama/viber-mcp'],
        env: {
          VIBER_AUTH_TOKEN: token,
          VIBER_SENDER_NAME: botName,
        },
      },
    },
  };
  fs.writeFileSync(mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
  console.log(green(`   ✓ Installed plugin into Antigravity: ${antigravityPluginDir}`));

  // 4. Vercel Deployment & Webhook Setup
  console.log('\n' + bold('Step 3: Webhook & Vercel Deployment'));
  let deployedUrl = '';

  const wantsVercel = !skipVercel && (args.includes('--deploy') || (await ask('Deploy webhook to Vercel automatically? (Y/n)', 'Y')).toUpperCase() === 'Y');

  if (wantsVercel) {
    // Check CLI (prefer bunx or npx)
    const vercelRunner = fs.existsSync(path.join(rootDir, 'bun.lock')) ? 'bunx vercel' : 'npx vercel';

    // Check login
    console.log('🔍 Checking Vercel login status...');
    let whoami = runCommand(`${vercelRunner} whoami`, { throwOnError: false });
    if (!whoami) {
      console.log(yellow('⚠️  You are not logged in to Vercel CLI. Launching login...'));
      spawnSync(vercelRunner.split(' ')[0], ['vercel', 'login'], { stdio: 'inherit', shell: true });
      whoami = runCommand(`${vercelRunner} whoami`, { throwOnError: false });
    }

    if (whoami) {
      console.log(green(`   ✓ Logged in as: ${whoami}`));
      console.log('🚀 Deploying production webhook to Vercel (this may take ~20 seconds)...');

      try {
        const deployOutput = runCommand(`${vercelRunner} --prod --yes`, { cwd: rootDir });
        const lines = deployOutput.split('\n').map((l) => l.trim()).filter(Boolean);
        // Look for the https://*.vercel.app URL
        const foundUrl = lines.reverse().find((l) => l.startsWith('https://') && l.includes('.vercel.app'));
        if (foundUrl) {
          deployedUrl = foundUrl;
          console.log(green(`   ✓ Deployed successfully to: ${deployedUrl}`));
        } else {
          console.log(yellow(`   ⚠️  Deployment finished. Output:\n${deployOutput}`));
        }

        // Add Env vars to Vercel
        console.log('🔑 Syncing environment variables to Vercel...');
        try {
          spawnSync(vercelRunner.split(' ')[0], ['vercel', 'env', 'add', 'VIBER_AUTH_TOKEN', 'production', '--force'], {
            input: token,
            encoding: 'utf8',
            shell: true,
            cwd: rootDir,
          });
          if (superadminId) {
            spawnSync(vercelRunner.split(' ')[0], ['vercel', 'env', 'add', 'VIBER_SUPERADMIN_ID', 'production', '--force'], {
              input: superadminId,
              encoding: 'utf8',
              shell: true,
              cwd: rootDir,
            });
          }
          console.log(green('   ✓ Environment variables synchronized to Vercel!'));
        } catch (envErr) {
          console.log(yellow(`   ⚠️  Could not auto-add env vars: ${envErr.message}`));
        }
      } catch (deployErr) {
        console.error(red(`❌ Vercel deployment error: ${deployErr.message}`));
      }
    } else {
      console.log(yellow('⚠️  Skipping automatic Vercel deploy (not logged in).'));
    }
  }

  // 5. Register Webhook with Viber
  console.log('\n' + bold('Step 4: Registering Webhook with Viber'));
  let webhookUrl = deployedUrl ? `${deployedUrl}/webhook` : '';

  if (!webhookUrl) {
    webhookUrl = await ask('Enter your public HTTPS webhook URL (e.g., https://your-app.vercel.app/webhook)', '');
  }

  if (webhookUrl && webhookUrl.startsWith('https://')) {
    const formattedUrl = webhookUrl.endsWith('/webhook') ? webhookUrl : `${webhookUrl.replace(/\/$/, '')}/webhook`;
    console.log(`📡 Registering: ${formattedUrl}`);

    try {
      const setRes = await fetch('https://chatapi.viber.com/pa/set_webhook', {
        method: 'POST',
        headers: {
          'X-Viber-Auth-Token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formattedUrl }),
      });
      const setResult = await setRes.json();
      if (setResult.status === 0) {
        console.log(green('   ✓ Viber Webhook registered and verified successfully!'));
      } else {
        console.log(yellow(`   ⚠️  Viber returned: ${setResult.status_message || setResult.status}`));
      }
    } catch (whErr) {
      console.error(red(`❌ Failed to register webhook: ${whErr.message}`));
    }
  } else {
    console.log(yellow('⚠️  Skipped webhook registration. (You can register it later via /api/set-webhook).'));
  }

  // 6. Optional Test Message
  if (superadminId) {
    console.log('\n' + bold('Step 5: Verification Test Message'));
    const sendTest = (await ask('Send a test announcement to your Viber Channel now? (Y/n)', 'Y')).toUpperCase() === 'Y';
    if (sendTest) {
      try {
        const testRes = await fetch('https://chatapi.viber.com/pa/post', {
          method: 'POST',
          headers: {
            'X-Viber-Auth-Token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: superadminId,
            type: 'text',
            text: '🚀 Viber Integration initialized successfully via Antigravity Setup Wizard!',
          }),
        });
        const testData = await testRes.json();
        if (testData.status === 0) {
          console.log(green('   ✓ Test post published to your Viber Channel!'));
        } else {
          console.log(yellow(`   ⚠️  Could not publish test post: ${testData.status_message}`));
        }
      } catch (postErr) {
        console.log(yellow(`   ⚠️  Error posting test message: ${postErr.message}`));
      }
    }
  }

  // Summary
  console.log('\n' + bold(green('=====================================================')));
  console.log(bold(green(' 🎉 All Set! Your Viber integration is ready.')));
  console.log(bold(green('=====================================================')));
  console.log(`
You can now ask your AI Agent:
  💬 ${bold('"@viber-bot send a message"')}
  💬 ${bold('"Post an announcement to my Viber Channel"')}
  💬 ${bold('"Check my Viber bot status"')}

Run ${cyan('bun dev')} to start the local webhook server anytime.
`);
}

main().catch((err) => {
  console.error(red(`\nFatal error: ${err.message}`));
  process.exit(1);
});
