import { test } from '../src/helpers/fixtures/fixture';
import { expect } from '@playwright/test';
import { UserBuilder } from '../src/helpers/builders/index';
//todo
const urlApi = 'https://apichallenges.eviltester.com';
test('Получить токен доступа', async ({
	request
}) => {
    // Получить ключ авторизации
    let response = await request.post(`${urlApi}/challenger`);
    // КОнвертировать хедеры в Json
    const headers = response.headers();

    // Вытащить токен из хедера
    const key = headers['x-challenger'];
    const link = `${urlApi}${headers.location}`

    console.log(link);
    expect(headers['x-challenger'].length).toEqual(36);
    
     response = await request.get(`${urlApi}/challenges`, {
        headers: {
            'X-CHALLENGER': key
        }
     });
     let r = await response.json(); 
     expect(r.challenges.length).toEqual(59);

     response = await request.post(`${urlApi}/todos`, {
        headers: {
            'X-CHALLENGER': key
        },
        // унести в билдер
        data: {
            'title': 'title',
            'doneStatus': false,
            'description': 'description'
        }
     });
     r = await response.json(); 
     expect(r.id).toBeTruthy();
     expect(r.title).toEqual('title');
     expect(r.doneStatus).toEqual(false);
     expect(r.description).toEqual('description');
});
