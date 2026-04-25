// tests/setup/global.teardown.js
import fs from 'fs';
import path from 'path';

export default async function globalTeardown() {
  const tokenPath = path.join(process.cwd(), '.auth', 'token.json');
  let token = 'unknown';
  let createdAt = 'unknown';
  let baseURL = 'https://apichallenges.eviltester.com';

  if (fs.existsSync(tokenPath)) {
    try {
      const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
      token = tokenData.token || 'invalid';
      createdAt = tokenData.createdAt || 'unknown';
      baseURL = tokenData.baseURL || baseURL;
      console.log(`🔍 [Teardown] Read token: ${token?.slice(0, 8)}...`);
    } catch (e) {
      console.error(`❌ [Teardown] Could not parse token file: ${e.message}`);
    }
  }

  const challengeUrl = `${baseURL}/gui/challenges/${token}`;

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           🏆 API CHALLENGES TEST RUN COMPLETE 🏆           ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  Token: ${token.padEnd(48)} ║`);
  console.log(`║  Created: ${createdAt.padEnd(44)} ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  📊 Verify your challenge progress:                        ║');
  console.log(`║  ${challengeUrl.padEnd(58)} ║`);
  console.log('║                                                            ║');
  console.log('║  💡 Если ячейки не зелёные:                               ║');
  console.log('║     • Нажмите Ctrl+Shift+R для сброса кэша браузера       ║');
  console.log('║     • Убедитесь, что токен в ссылке совпадает с логом     ║');
  console.log('║     • Подождите 15-30 секунд — сервер обновляет статус   ║');
  console.log('║     • Запустите тесты ещё раз с тем же токеном           ║');
  console.log('║                                                            ║');
  console.log('║  ✅ Green = Completed challenges                           ║');
  console.log('║  ❌ Red = Pending challenges                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // 🔹 Сохраняем отчёт в файл
  try {
    const reportPath = path.join(process.cwd(), 'test-results', 'challenge-report.txt');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, 
`Challenge Progress Report
========================
Token: ${token}
Created: ${createdAt}
Base URL: ${baseURL}
URL: ${challengeUrl}
Generated: ${new Date().toISOString()}
`, 'utf-8');
    console.log(`📄 Report saved to: ${reportPath}`);
  } catch (e) {
    console.warn(`⚠️ Could not save report file: ${e.message}`);
  }
}