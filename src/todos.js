const express = require('express')
const router = express.Router()

const todos = {}
let nextId = 0;

const CREATED = 201
const NO_CONTENT = 204
const NOT_FOUND = 404

router.get('/', function getAll(req, res) {
    const allTodos = Object.keys(todos).map(function (key) {
        return todos[key]
    })
    res.json(allTodos)
})

router.get('/suggestions/:filter', function makeSuggestion(req, res) {
    const filteredKeys = Object.keys(todos).filter(function (key) {
        return todos[key].text.indexOf(req.params.filter) > -1
    })
    const filteredTodos = filteredKeys.map(function (key) {
        return todos[key]
    })
    res.json(filteredTodos)
})

router.get('/:id', function getDetails(req, res) {
    const todo = todos[req.params.id]
    if (todo) {
        res.json(todo)
    } else {
        res.status(NOT_FOUND).end()
    }
})

router.post('/', function create(req, res) {
    const todo = req.body
    todos[nextId] = todo
    todo.id = nextId
    nextId++
    res.status(CREATED).set('Location', todo.id).end()
})

router.put('/:id', function update(req, res) {
    if (todos[req.params.id]) {
        todos[req.params.id] = req.body
        res.status(NO_CONTENT).end()
    } else {
        res.status(NOT_FOUND).end()
    }
})

router.delete('/:id', function remove(req, res) {
    if (todos[req.params.id]) {
        delete todos[req.params.id]
        res.status(NO_CONTENT).end()
    } else {
        res.status(NOT_FOUND).end()
    }
})

module.exports = router
