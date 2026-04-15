// src/service/challenges.service.js
import { test } from '../helpers/fixtures/fixture';



export class ChallengesService {
  constructor(request) {
    this.request = request;
  }

  async get(token) {
    const response = await this.request.get('/challenges', {
      headers: { 'X-CHALLENGER': token }
    });
    return await response.json();
  }
}

/*
//todo
 const urlApi = 'https://apichallenges.eviltester.com';
 
 export class ChallengesService {
    constructor (request) {
        this.request = request;
    }
async get (token) {
    return test.step ('POST /challenger', async() => { 

    const response = await this.request.get(`${urlApi}/challenges`, 
        {
            headers: {
                'X-CHALLENGER': token
            }
         }
    );
    const r = await response.json(); 
    return r;

})
    }
 }
*/
