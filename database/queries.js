const db = require('./connect');

// get all sessions
function allSessions(callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;
        
        connection.query(`
            select * from session;
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get all exercises
function allExercises(callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from exercise;
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get all sets
function allSets(callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from sett;
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get session by id
function getSession(session_id, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from session where id = ${session_id};
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get exercise by id
function getExercise(exercise_id, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from exercise where id = ${exercise_id};
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get set by id
function getSet(sett_id, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from sett where id = ${sett_id};
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get session by time
function sessionByTime(session_time, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from session where time = '${sqlTime(session_time)}';
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get exercises by session
function exercisesBySession(session_id, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select id, name 
            from exercise, exercise_of 
            where exercise.id = exercise_of.exercise_id and exercise_of.session_id = ${session_id};
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}

// get sets by exercise
function setsByExercise(exercise_id, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select id, weight, reps
            from sett, sett_of
            where sett.id = sett_of.sett_id and sett_of.exercise_id = ${exercise_id};
        `, (err, rows) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(rows)));

            connection.release();
        });
    });
}


// get sessions by concentration
function sessionsByConcentration(concentration, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from session where concentration = '${concentration}'; 
        `, (err, data) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(data)));

            connection.release();
        });
    });
}

// get exercises by name
function exercisesByName(exercise_name, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select * from exercise where name = '${exercise_name}';
        `, (err, data) => {
            if (err) throw err;

            callback(JSON.parse(JSON.stringify(data)));

            connection.release();
        });
    });
}

// get exercise stats: max weight, max reps, avg weight, avg reps, total sets, total reps
function exerciseStats(exercise_name, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select name, max(weight) as max_weight, max(reps) as max_reps, avg(weight) as avg_weight, avg(reps) as avg_reps, count(sett_id) as total_sets, sum(reps) as total_reps
            from exercise, sett_of, sett
            where exercise.id = sett_of.exercise_id and sett.id = sett_of.sett_id
            and name = '${exercise_name}';
        `, (err, data) => {
            if (err) throw err;

            callback(data);

            connection.release();
        });
    });
}

function plotData(exercise_name, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
        select time, max(weight) as max_weight, max(reps) as max_reps, min(weight) as min_weight, min(reps) as min_reps
        from session, exercise_of, exercise, sett_of, sett
        where session.id = exercise_of.session_id and exercise.id = exercise_of.exercise_id 
        and exercise.id = sett_of.exercise_id and sett.id = sett_of.sett_id
        and name = '${exercise_name}'
        group by session.id;
        `, (err, data) => {
            if (err) throw err;

            data = JSON.parse(JSON.stringify(data));
            
            console.log(data);
            callback(data);

            connection.release();
        });
    });
}


// input a new session
function newSession(session_id, concentration, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            insert into session (id, concentration, time) values (${session_id}, '${concentration}', '${sqlTime()}');
        `, (err) => {
            if (err) throw err;

            connection.release();

            callback();
        });
    });
}

// input a new exercise
function newExercise(exercise_id, exercise_name, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            insert into exercise (id, name) values (${exercise_id}, '${exercise_name}');
        `, (err) => {
            if (err) throw err;

            connection.release();

            callback();
        });
    });
}

// input a new sett
function newSett(sett_id, weight, reps, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            insert into sett (id, weight, reps) values(${sett_id}, '${weight}', '${reps}');
        `, (err) => {
            if (err) throw err;

            connection.release();

            callback();
        })
    });
}

// get last session
function getLastSession(callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select max(id) as last_session from session;
        `, (err, data) => {
            if (err) throw err;

            connection.release();

            callback(JSON.parse(JSON.stringify(data))[0].last_session);
        });
    });
}

// get last exercise
function getLastExercise(callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select max(id) as last_exercise from exercise;
        `, (err, data) => {
            if (err) throw err;

            connection.release();

            callback(JSON.parse(JSON.stringify(data))[0].last_exercise);
        });
    });
}

// get last sett
function getLastSett(callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            select max(id) as last_sett from sett;
        `, (err, data) => {
            if (err) throw err;

            connection.release();

            callback(JSON.parse(JSON.stringify(data))[0].last_sett);
        });
    });
}

// input a new exercise_of
function newExercise_of(session_id, exercise_id, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            insert into exercise_of (session_id, exercise_id) values (${session_id}, ${exercise_id})
        `, (err) => {
            if (err) throw err;

            connection.release();

            callback();
        });
    });
}

// input a new sett_of
function newSett_of(exercise_id, sett_id, callback) {
    db.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(`
            insert into sett_of (exercise_id, sett_id) values (${exercise_id}, ${sett_id})
        `, (err) => {
            if (err) throw err;
        
            connection.release();

            callback();
        });
    });
}

// get current time in mysql format (YYYY-MM-DD hh:mm:ss)
function sqlTime(date = new Date()) {
    return date.getFullYear() + '-' + String(Number(date.getMonth()) + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

module.exports = { 
    allSessions, allExercises, allSets, 
    getSession, getExercise, getSet, 
    sessionByTime, exercisesBySession, setsByExercise, 
    sessionsByConcentration, exercisesByName, exerciseStats, 
    plotData,
    newSession, newExercise, newSett,
    getLastSession, getLastExercise, getLastSett,
    newExercise_of, newSett_of
};