const jsonServer = require('json-server')
const auth = require('json-server-auth')
const express = require('express')

const app = express()
const apiServer = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const args = process.argv.slice(2);

app.use(express.static('public'));

app.use('/node_modules', express.static(__dirname + '/node_modules/'));

apiServer.use(jsonServer.rewriter({
    '/api/*': '/$1'
}))

apiServer.db = router.db

let port = 'passenger'
if(args[0] == 'dev') {
    port = 3000
}

app.listen(port, () => {
    console.log(`Example app listening on port 3000`)
})

const rules = auth.rewriter({
    users: 600,
    clients: 600,
    depots: 600
})

app.use('/api', apiServer.use(rules), apiServer.use(middlewares), apiServer.use(auth), apiServer.use(router));
