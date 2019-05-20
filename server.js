const express = require('express');
const {FlightNotFound, FlightAlreadyExists} = require("./errors/errors.js");
const app = express();

app.use(express.json());
app.use('/flight', require('./routes/flights.js'));

app.use(function (err, req, res, next) {

    if( err instanceof FlightNotFound ){
        return res.status(404).send(err.message);
    }

    if( err instanceof FlightAlreadyExists){
        return res.status(400).send(err.message);
    }
    // If the error is not known
    console.error(err.stack);
    res.status(500).end();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});