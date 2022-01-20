// data.js - routes to send data to the client

const express = require('express');
const router = express.Router();
const { 
    allSessions, allExercises, allSets, 
    getSession, sessionByTime, getExercise, 
    exercisesBySession, setsByExercise, sessionsByConcentration, 
    exercisesByName, exerciseStats, plotData } = require('../database/queries');

// get all sessions
router.post('/sessions', (req, res) => {
    // get sessions by concentration
    if (req.body.concentration) {
        const concentration = String(req.body.concentration).trim();

        sessionsByConcentration(concentration, (data) => {
            validDates(data);
            sendData(data, res)
        });
    }
    // get all sessions
    allSessions((data) => {
        validDates(data);
        sendData(data, res);
    });
}); 

// get all exercises
router.post('/exercises', (req, res) => {
    // get exercises by session_id
    if (req.body.session_id) {
        if (!isNaN(req.body.session_id)) {
            const session_id = parseInt(req.body.session_id);

            exercisesBySession(session_id, (data) => sendData(data, res));
        }
        else {
            res.status(400).send({ error: 'session_id must be an integer' });
        }
    }
    // get exercises by exercise_name
    if (req.body.exercise_name) {
        const exercise_name = req.body.exercise_name.trim();

        // get exercise stats
        if (req.body.show_stats) {
            exerciseStats(exercise_name, (data) => sendData(data, res, true));
        }
        // get plot data
        else if (req.body.plot_data) {
            plotData(exercise_name, (data) => sendData(data, res));
        }
        else {
            exercisesByName(exercise_name, (data) => sendData(data, res));
        }
    }
    // get all exercises
    else {
        allExercises((data) => {
            sendData(data, res);
        });
    }
});

router.get('/sets', (req, res) => {
    // get sets by exercise_id
    if (req.body.exercise_id) {
        if (!isNaN(req.body.exercise_id)) {
            const exercise_id = parseInt(req.body.exercise_id);

            setsByExercise(exercise_id, (data) => sendData(data, res));
        }
        else {
            res.status(400).send({ error: 'exercise_id must be an integer' });
        }
    }
    // get all sets
    else {
        allSets((data) => sendData(data, res));
    }
});

// get session by id or time
router.post('/session', (req, res) => {
    // get session by id
    if (req.body.session_id) {
        if (!isNaN(req.body.session_id)) {
            const session_id = parseInt(req.body.session_id);

            getSession(session_id, (data) => sendData(data, res, true));
        }
        else {
            res.status(400).send({ error: 'session_id must be an integer'});
        }
    }
    // get session by time
    else if (req.body.session_time) {
        if (req.body.session_time != 'Invalid Date') {
            const session_time = new Date(req.body.session_time);

            sessionByTime(session_time, (data) => sendData(data, res, true));
        }
    }
    else {
        res.status(400).send({ error: 'neither session_id nor session_time was specified'});
    }
});

// get exercise by id
router.get('/exercise', (req, res) => {
    if (req.body.exercise_id) {
        if (!isNaN(req.body.exercise_id)) {
            const exercise_id = parseInt(req.body.exercise_id);

            getExercise(exercise_id, (data) => sendData(data, res, true));
        }
        res.status(400).send({ error: 'exercise_id must be an integer' });
    }
    else {
        res.status(400).send({ error: 'exercise_id not specified' });
    }
});

// get set by id
router.get('/set', (req, res) => {
    if (req.body.set_id) {
        if (!isNaN(req.body.set_id)) {
            const set_id = parseInt(req.body.set_id);

            getExercise(set_id, (data) => sendData(data, res, true));
        }
        else {
            res.status(400).send({ error: 'set_id must be an integer' });
        }
    }
    else {
        res.status(400).send({ error: 'set_id not specified' });
    }
});

// get sets by exercise


function sendData(data, res, single = false) {
    if (data.length > 0) {
        single ? res.send(data[0]) : res.send(data);
    }
    else {
        res.send({ message: 'no data found. either the database is empty or you are sending invalid values' });
    }
}

// change date from string to Date obj
function validDates(data) {
    for (let i = 0; i < data.length; i++) {
        data[i].time = new Date(data[i].time);
    }
}

module.exports = router;