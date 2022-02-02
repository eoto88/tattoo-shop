require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');

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

const args = process.argv.slice(2);

app.use(express.static('public'));

app.use('/node_modules', express.static(__dirname + '/node_modules/'));

let port = 'passenger'
if(args[0] == 'dev') {
    port = 3000
}

app.listen(port, () => {
    console.log(`Example app listening on port 3000`)
})
