import fs from 'fs';
import path from 'path';

export default async function globalTeardown() {
  const tokenPath = path.join(process.cwd(), '.auth', 'token.json');
  let token = 'unknown';

  if (fs.existsSync(tokenPath)) {
    const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
    token = tokenData.token;
  }

  const challengeUrl = `https://apichallenges.eviltester.com/gui/challenges/${token}`;

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           🏆 API CHALLENGES TEST RUN COMPLETE 🏆           ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  Token: ${token}               ║`);
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log('║  📊 Verify your challenge progress:                        ║');
  console.log(`║  ${challengeUrl.padEnd(58)} ║`);
  console.log('║                                                            ║');
  console.log('║  ✅ Green = Completed challenges                           ║');
  console.log('║  ❌ RED = Pending challenges                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
/*
  // Сохраняем в файл
  const reportPath = path.join(process.cwd(), 'test-results', 'challenge-report.txt');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `Challenge URL: ${challengeUrl}\nToken: ${token}\n`);

  // Открываем браузер (опционально)
  // import { exec } from 'child_process';
  // exec(`start ${challengeUrl}`);
*/
}