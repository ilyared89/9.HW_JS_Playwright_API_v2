// src/service/challenger.service.js

export class ChallengerService {
  constructor(request) {
    this.request = request;
  }

  async post() {
    //   baseURL подставится из playwright.config.js автоматически
    const response = await this.request.post('/challenger');
    const headers = response.headers();
    return headers['x-challenger'];
  }
}

/*
import { test } from '../helpers/fixtures/fixture';
//todo
 const urlApi = 'https://apichallenges.eviltester.com';

 export class ChallengerService {
    constructor (request) {
        this.request = request;
    }
async post () {
    return test.step ('POST /challenger', async() => { 

    const response = await this.request.post(`${urlApi}/challenger`);
    const headers = response.headers();
    // Вытащить токен из хедера
    const key = headers['x-challenger'];

    // todo для удобства
    const link = `${urlApi}${headers.location}`
    console.log(link);
    return key;

})
    }
 } 
     */