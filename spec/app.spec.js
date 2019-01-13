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
        const postResponse1 = await client.post('/api/todos').send({ text: "todo1" }).expect(201)
        const postResponse2 = await client.post('/api/todos').send({ text: "todo2" }).expect(201)

        const response = await client.get('/api/todos').expect(200)
        expect(response.body.length).toBe(2)

        await client.delete(`/api/todos/${postResponse1.headers['location']}`)
        await client.delete(`/api/todos/${postResponse2.headers['location']}`)
    })

    it('should respond with "404" for unknown URL', async function () {
        await client.get('/api/todos/0').expect(404)
        await client.put('/api/todos/0').expect(404)
        await client.delete('/api/todos/0').expect(404)
    })

    it('should process the CRUD operations as expected', async function () {
        const postResponse = await client.post('/api/todos').send({ text: 'test' }).expect(201)
        const id = postResponse.headers['location']
        expect(id).toBeDefined()

        await client.put(`/api/todos/${id}`).send({ text: 'test updated' }).expect(204)

        const getResponse = await client.get(`/api/todos/${id}`).expect(200)
        const todo = getResponse.body
        expect(todo.text).toBe('test updated')

        await client.delete(`/api/todos/${id}`).expect(204)
    })

    it('should make suggestions based on a filter word', async function () {
        const postResponse1 = await client.post('/api/todos').send({ text: 'eat' }).expect(201)
        const id1 = postResponse1.headers['location']
        const postResponse2 = await client.post('/api/todos').send({ text: 'sleep' }).expect(201)
        const id2 = postResponse2.headers['location']

        let suggestionsResponse = await client.get('/api/todos/suggestions/z').expect(200)
        let suggestions = suggestionsResponse.body
        expect(suggestions.length).toBe(0)

        suggestionsResponse = await client.get('/api/todos/suggestions/at').expect(200)
        suggestions = suggestionsResponse.body
        expect(suggestions.length).toBe(1)
        expect(suggestions[0].id).toBe(parseInt(id1))

        suggestionsResponse = await client.get('/api/todos/suggestions/ee').expect(200)
        suggestions = suggestionsResponse.body
        expect(suggestions.length).toBe(1)
        expect(suggestions[0].id).toBe(parseInt(id2))

        suggestionsResponse = await client.get('/api/todos/suggestions/e').expect(200)
        suggestions = suggestionsResponse.body
        expect(suggestions.length).toBe(2)

        suggestionsResponse = await client.get('/api/todos/suggestions/').expect(200)
        suggestions = suggestionsResponse.body
        expect(suggestions.length).toBe(0)

        await client.delete(`/api/todos/${id1}`).expect(204)
        await client.delete(`/api/todos/${id2}`).expect(204)
    })
})
