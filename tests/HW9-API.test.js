import { test } from '../src/helpers/fixtures/fixture';
import { expect } from '@playwright/test';
import { ApiBuilder } from '../src/helpers/builders/index';


//todo
const urlApi = 'https://apichallenges.eviltester.com';
const todoData = ApiBuilder.create()
    .withTitle('title')
    .withDoneStatus(false)
    .withDescription('description')
    .build();

    /*Получить токен доступа*/
test('Получить токен доступа', async ({
	request
}) => {
    // Получить ключ авторизации
    let response = await request.post(`${urlApi}/challenger`);
    // Конвертировать хедеры в Json
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
        data: todoData
     });
     r = await response.json(); 
     expect(r.id).toBeTruthy();
     expect(r.title).toEqual('title');
     expect(r.doneStatus).toEqual(false);
     expect(r.description).toEqual('description');
});
