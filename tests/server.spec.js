const request = require('supertest');
const server = require('../index');
const jwt = require('jsonwebtoken');

describe('Operaciones CRUD de cafes', () => { 
// This test is chkeing that the GET /cafes endpoint returns a 200 status code and the response is an array with at least one element
it('Obtaining a 200 and a array response with at least one element', async () => {
  const response = await request(server).get('/cafes');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
  //at least one element
  expect(response.body.length).toBeGreaterThan(0);
});

// This test is checking the behavior of a DELETE request to the /cafes/:id endpoint when trying to delete a coffee that does not exist
  it('Obtaining a 404 when deleting a non existing coffee', async () => {
    const jwt = 'token';
    const idCoffee = 5;
    const response = await request(server)
      .delete(`/cafes/${idCoffee}`)
      .set('Authorization', jwt);
    expect(response.status).toBe(404);
  });

  // This test is checking the behavior of a POST request to the /cafes endpoint when adding a new coffee
  it('Add new coffee and get 201', async () => {
    const newCoffee = {
      id: Date.now(), // Use the current timestamp as a unique id
      nombre: 'Cafe frapuccino',
    };
    const response = await request(server)
      .post('/cafes')
      .send(newCoffee);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(newCoffee)); // Check that the response body includes the newCoffee data

    // Cleanup: Delete the coffee that was created during the test
    await request(server).delete(`/cafes/${newCoffee.id}`);
  });


  // This test is checking the behavior of a PUT request to the /cafes/:id endpoint when the id in the URL parameters does not match the id in the JWT token payload
  it('Update coffee, obtain 400 by parameter, diffrent than payload id', async () => {
    const payloadFine = { id: 1 };
    const jwtToken = jwt.sign(payloadFine, 'secret');
    const ifCoffee = 5;
    const payload = jwt.verify(jwtToken, 'secret');

    if (payload.id !== ifCoffee) {
      const response = await request(server)
        .put(`/cafes/${ifCoffee}`)
        .set('Authorization', jwtToken);
      expect(response.status).toBe(400);
    }
  });
});
