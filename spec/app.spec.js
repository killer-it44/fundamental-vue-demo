const request = require('supertest')
const app = require('../src/app')

describe('app', function () {

    let client

    beforeAll(function () {
        client = request(app)
    })

    it('should respond with empty list when there is no data', async function () {
        const response = await client.get('/api/todos').expect(200)
        expect(response.body).toEqual([])
    })

    it('should respond with the list of entries created before', async function () {
        const todo1Response = await client.post('/api/todos').send({ text: "todo1" }).expect(201)
        const todo2Response = await client.post('/api/todos').send({ text: "todo2" }).expect(201)

        const response = await client.get('/api/todos').expect(200)
        expect(response.body.length).toEqual(2)

        await client.delete(`/api/todos/${todo1Response.headers['location']}`)
        await client.delete(`/api/todos/${todo2Response.headers['location']}`)
    })

    it('should respond with "404" for unknown URL', async function () {
        await client.get('/api/todos/0').expect(404)
        await client.put('/api/todos/0').expect(404)
        await client.delete('/api/todos/0').expect(404)
    })

    it('should process the CRUD operations as expected', async function () {
        const postResponse = await client.post('/api/todos').send({ text: 'test' }).expect(201)
        id = postResponse.headers['location']
        expect(id).toBeDefined()

        await client.put(`/api/todos/${id}`).send({ text: 'test updated' }).expect(204)

        const getResponse = await client.get(`/api/todos/${id}`).expect(200)
        const todo = getResponse.body
        expect(todo.text).toEqual('test updated')

        await client.delete(`/api/todos/${id}`).expect(204)
    })
})
