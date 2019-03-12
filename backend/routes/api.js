var express = require('express');
var router = express.Router();

function apiInit(db){
    var practicaApi = require ('./api/practica')(db);

    router.use('/practica', practicaApi);

    return router;
}

module.exports = apiInit;