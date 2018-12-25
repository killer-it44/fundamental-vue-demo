const express = require('express')
const todos = require('./todos')

const app = express()

app.use(express.static('src/web-content'))

app.use('/vue', express.static(__dirname + '/../node_modules/vue/dist/'))
app.use('/vue-router', express.static(__dirname + '/../node_modules/vue-router/dist/'))
app.use('/fundamental-vue', express.static(__dirname + '/../node_modules/fundamental-vue/dist/'))
app.use('/fiori-fundamentals', express.static(__dirname + '/../node_modules/fiori-fundamentals/dist/'))
app.use('/superagent', express.static(__dirname + '/../node_modules/superagent/'))

app.use(express.json())
app.use('/api/todos', todos)

module.exports = app
