require('dotenv').config()
// const jsonServer = require('json-server')
// const auth = require('json-server-auth')
const express = require('express')
var bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.disable('x-powered-by')

app.use('/api', [
    require('./api/routes/auth_routes'),
    require('./api/routes/user_routes'),
    require('./api/routes/client_routes'),
    require('./api/routes/depot_routes'),
])

app.use('/api', require('./api/middleware/error_middleware').all)

// const apiServer = jsonServer.create()
// const router = jsonServer.router('db.json')
// const middlewares = jsonServer.defaults()

// const knex = require('knex')({
//     client: 'mysql2',
//     connection: {
//         host : process.env.DB_HOST,
//         port : process.env.DB_PORT,
//         user : process.env.DB_USER,
//         password : process.env.DB_PASS,
//         database : 'tattoo_shop'
//     }
// });

const args = process.argv.slice(2);

app.use(express.static('public'));

app.use('/node_modules', express.static(__dirname + '/node_modules/'));

// apiServer.use(jsonServer.rewriter({
//     '/api/*': '/$1'
// }))

// apiServer.db = router.db

// app.use(require('./api/routes'));

// const rules = auth.rewriter({
//     users: 600,
//     clients: 600,
//     depots: 600
// })
// app.use('/api', apiServer.use(rules), apiServer.use(middlewares), apiServer.use(auth), apiServer.use(router));

let port = 'passenger'
if(args[0] == 'dev') {
    port = 3000
}

app.listen(port, () => {
    console.log(`Example app listening on port 3000`)
})
