import express from "express";
import { Low, JSONFile } from 'lowdb'

const port = 3000
const app = express();
app.use(express.json())

const adapter = new JSONFile('db.json')
const db = new Low(adapter)
await db.read()
db.data ||= { clients: [] }

const { clients, depots } = db.data

app.get('/client/:id', async (req, res) => {
    const client = clients.find((p) => p.id === req.params.id)
    const clientProjets = depots.find((p) => p.id_client === req.params.id)
    console.log(clientProjets);
    res.send(client)
});

app.post('/client', async (req, res, next) => {
    const client = clients.push(req.body)
    await db.write()
    res.send(client)
});

app.listen(port, function() {
    console.log(`Example app listening at http://localhost:${port}`)
});