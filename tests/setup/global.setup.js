import { request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function globalSetup() {

  // Создаем директорию для хранения токена
  const authDir = path.join(process.cwd(), '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }
  
  // Создаем новую challenger сессию
  const apiRequest = await request.newContext({
    baseURL: 'https://apichallenges.eviltester.com'
  });
  
  const response = await apiRequest.post('/challenger', {
    headers: {
      'Accept': 'application/json'
    }
  });
  
  if (response.status() !== 201) {
    throw new Error(`Failed to create challenger session: ${response.status()}`);
  }
  
  // Получаем токен из заголовка
  const token = response.headers()['x-challenger'];
  
  if (!token) {
    throw new Error('X-CHALLENGER token not found in response headers');
  }
    
  // Сохраняем токен в файл
  const tokenData = {
    token: token,
    createdAt: new Date().toISOString(),
    baseURL: 'https://apichallenges.eviltester.com'
  };
  
  fs.writeFileSync(
    path.join(authDir, 'token.json'),
    JSON.stringify(tokenData, null, 2)
  );
  
  console.log('✓ Token saved to .auth/token.json');
  
  // Проверяем, что challenges доступны
  const challengesResponse = await apiRequest.get('/challenges', {
    headers: {
      'X-CHALLENGER': token,
      'Accept': 'application/json'
    }
  });
  
  if (challengesResponse.status() === 200) {
    const challenges = await challengesResponse.json();
    const completedCount = challenges.challenges.filter(c => c.status).length;
    //console.log(`✓ Challenges loaded: ${completedCount}/${challenges.challenges.length} completed`);
  }
  
  await apiRequest.dispose();
  console.log('=== Global Setup Completed ===');
}