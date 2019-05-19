const express = require('express');
const mysql = require('mysql');
const server = express();
const mysquelcredentials = require('./mysqlcreds.js')

const db = mysql.createConnection(mysquelcredentials);

// directory name
server.use(express.static(__dirname + '../'));
server.use(express.urlencoded({extended: false}));

server.get('/api/tasks', (request, response) => {
    db.connect( () => {
        const query = "SELECT * FROM `tasks`";
        
        db.query(query, (error, data) => {
            const output = {
                success: false,
            }

            if (!error) {
                output.success = true;
                output.data = data;
            } else {
                output.error = error;
            }

            res.send(output);
        })
    })
});

server.post('/api/tasks', (request, response) => {
    if (request.body.task === undefined) {
        response.send( {
            success: false,
            error: 'Invalid task.'
        });

        return;
    }

    db.connect( () => {
        const task = request.body.task;

        const query = 'INSERT INTO `tasks` SET `task` = "'+task+'", `date` = NOW()';
        console.log(query);

        db.query(query, (error, result) => {
            if (!error) {
                response.send({
                    success: true,
                    new_id: result.insertID
                });
            } else {
                response.send({
                    success: false,
                    error
                });
            }
        })
    })
});

server.delete('/api/tasks', (request, response) => {
    console.log(request.query);

    if (request.query.task === undefined) {
        response.send({
            success: false,
            error: 'Must provide task ID'
        });

        return;
    }

    db.connect( () => {
        const query = 'DELETE FROM `grades` WHERE `taskID` = ' + request.query.taskID;

        db.query(query, (error, result) => {
            if (!error) {
                response.send({
                    success: true
                });
            } else {
                response.send({
                    success: false,
                    error: 'Task ID invalid'
                })
            }
        })
    })
});

// what port should I be using?
server.listen(3001, () => {
    console.log('carrier has arrived')
})