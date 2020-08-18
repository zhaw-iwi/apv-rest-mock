const express = require('express')
const app = express()
const port = 3000

let db = require("./data/db.json")

for (let table of db) {

    // GET /api/<table_name>
    app.get('/api/' + table.table_name, (req, res) => {
        res.send(table.records)
    })

    // GET /api/<table_name>/:id
    app.get('/api/' + table.table_name + '/:id', (req, res) => {
        let id = req.params.id;
        let record = table.records.find(record => record.id == id);
        if (record) {
            res.send(record)
        }
        else {
            res.sendStatus(404)
        }
    })

    // POST /api/<table_name>
    // TODO
}

app.get('/api', (req, res) => {
    let doc = `
    <body>    
        <h1>Welcome to the simple REST mock server</h1>
        <p>This API provides the following endpoints:</p>
        <ul>`
    
    for (let table of db) {
        doc += '<li>/api/' + table.table_name + " - " + table.description + '</li>';
    }

    doc += `
        </ul>
    </body>`

    res.send(doc)
})

app.get('/', (req, res) => {
    res.redirect('/api')
})


app.listen(port, () => {
    console.log(`Mock server listening at http://localhost:${port}`)
})
