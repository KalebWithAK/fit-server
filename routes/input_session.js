const express = require('express');
const { setMaxListeners } = require('../database/connect');
const router = express.Router();
const { 
    newSession, newExercise, newSett, 
    newExercise_of, newSett_of,
    getLastSession, getLastExercise, getLastSett
} = require('../database/queries');

router.post('/', (req, res) => {
    if (req.body) {
        const { concentration, exercises } = req.body;

        // get original last_session
        getLastSession((last_session) => {
            // get original last_exercise
            getLastExercise((last_exercise) => {
                // get_original last_sett
                getLastSett((last_sett) => {

                    // new session_id = last session + 1
                        const new_session = last_session + 1;
                        newSession(new_session, concentration, () => {
                            
                            exercises.forEach(e => {
                                const new_exercise = last_exercise + 1;

                                newExercise(new_exercise, e.exercise_name, () => {
                                    newExercise_of(new_session, new_exercise, () => {
                                        //console.log(`session: ${new_session}, exercise: ${new_exercise}`);
                                    });
                                });

                                e.sets.forEach(s => {
                                    const new_sett = last_sett + 1;

                                    newSett(new_sett, s.weight, s.reps, () => {
                                        newSett_of(new_exercise, new_sett, () => {
                                            //console.log(`exercise: ${new_exercise}, sett: ${new_sett}`);
                                        });
                                    });

                                    last_sett = new_sett;
                                });

                                last_exercise = new_exercise;
                            });
                        });

                    res.send({message: 'session input was successful :)'});
                });
            });

            
            // each new exercise_id = original last_exercise + index
            // each new sett_id = original last_sett + index
        });
    }
});

function sessionCount(last_session, callback) {
    callback(last_session + 1);
}

function exerciseCount(last_exercise, callback) {
    callback(last_exercise + 1);
}

module.exports = router;