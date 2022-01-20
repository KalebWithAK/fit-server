const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const data_routes = require('./routes/data');
const session_routes = require('./routes/input_session');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use('/data', data_routes);
app.use('/input_session', session_routes);
app.get('/', (req, res) => {
    res.send(JSON.stringify({ message: 'hello :)' }));
});


app.listen(3001, () => {
    console.log(`server listening at http://localhost:${port}/`);
});