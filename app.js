require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const {Client, Depot} = require("./api/models");

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors())

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
    port = 3005
}

if(args[1] == 'import') {
    var db = require('./db.json')

    Promise.all(db.clients.map(client => {
        Client.create({
            id: client.id,
            name: client.name,
            id_user: 11
        }).then(function(result) {
            console.log(result)
        })
    }))

    Promise.all(db.depots.map(depot => {
        Depot.create({
            id: depot.id,
            id_user: 11,
            id_client: depot.clientId,
            date_depot: depot.dateDepot,
            montant: depot.montant,
            etat: depot.etat,
            date_etat: depot.dateEtat == '' ? null : depot.dateEtat,
            note: depot.note
        }).then(function(result) {
            console.log(result)
        })
    }))
}


app.listen(port, () => {
    console.log(`Example app listening on port 3000`)
})
