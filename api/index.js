require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const { Client, Depot } = require("./models");

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors())

app.disable('x-powered-by')

app.use('/', [
    require('./routes/auth_routes'),
    require('./routes/client_routes'),
    require('./routes/depot_routes'),
])

app.use('/', require('./middleware/error_middleware').all)

const args = process.argv.slice(2);

let port = 'passenger';
if(args[0] == 'dev') {
    port = 3005;
}

app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
})

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
