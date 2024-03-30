const request = require('supertest');
const app = require('./server'); // Adjust this path to where your Express app is exported

describe('GET /api/formFields', () => {
  it('responds with json containing a list of form fields', async () => {
    const response = await request(app)
      .get('/api/formFields')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: expect.any(Number),
        label: expect.any(String),
        type: expect.any(String),
        placeholder: expect.any(String)
      })
    ]));
  });
});
