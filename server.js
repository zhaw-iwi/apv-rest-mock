const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());


const port = process.env.PORT || 3000;

const data_path = path.join(__dirname, 'data');

var db = [];

fs.readdir(data_path, (err, files) => {
    if (err) {
        console.log("could not open directory");
    }
    else {
        for (let file of files) {
            if (path.extname(file) === '.json') {
                let data = require(path.join(data_path, file));
                let endpointName = path.basename(file, '.json')

                db.push({
                    "name": endpointName,
                    "records": data
                })
            }
        }
        createEndpoints();
        createRootEndpoint();
    }
})


function createEndpoints() {

    for (let table of db) {
        let tableName = table.name;
        let records = table.records;

        // GET /api/<tableName>
        app.get('/api/' + tableName, (req, res) => {
            res.send(records)
        })

        // GET /api/<table_name>/:id
        app.get('/api/' + tableName + '/:id', (req, res) => {
            let id = req.params.id;
            let record = records.find(record => record.id == id);
            if (record) {
                res.send(record)
            }
            else {
                res.sendStatus(404)
            }
        })

        // DELETE /api/<table_name>/:id
        app.delete('/api/' + tableName + '/:id', (req, res) => {
            let id = req.params.id;
            let index = records.findIndex(record => record.id == id);
            if (index >= 0 ) {
                records.splice(index, 1);
                res.send("Item with ID " + id + ' has been successfully deleted.')
            }
            else { 
                res.sendStatus(404)
            }
        })

        // POST /api/<tableName>
        app.post('/api/' + tableName, (req, res) => {
            
            // find the first free id
            let found = false;
            let id = 1;
            while (!found) {
                let index = records.findIndex(record => record.id == id);
                if ( index < 0) {
                    found = true;
                }
                else {
                    id++;
                }
            }
            
            let record = req.body;
            record.id = id;
            table.records.push(record);
            table.records.sort((a,b) => a.id - b.id);
            res.send(record);
        })
    }
} 

function createRootEndpoint() {
    app.get('/api', (req, res) => {
        let doc = `
            <body>    
                <h1>Welcome to the simple REST mock server</h1>
                <p>This API provides the following endpoints:</p>`

        for (let table of db) {
            let name = table.name;
            doc += '<h2>' + name + '</h2>';

            doc += '<ul>'
            doc += '<li>GET /api/' + name + ' - Get a list of all items in the collection ' + name + '</li>';
            doc += '<li>GET /api/' + name + '/{id} - Get a an item in the collection ' + name + ' by ID</li>';
            doc += '<li>DELETE /api/' + name + '/{id} - Delete a an item in the collection ' + name + ' by ID</li>';
            doc += '<li>POST /api/' + name + ' - Create a new item in the collection ' + name
            doc += '<p>Example:</p>';
            doc += '<pre>' + JSON.stringify(table.records[0], null, 2) + '</pre>';
            doc += '</li></ul>'
        }

        doc += '</body>'

        res.send(doc)
    })

}

app.listen(port, () => {
    console.log(`Mock server listening at http://localhost:${port}`)
})
