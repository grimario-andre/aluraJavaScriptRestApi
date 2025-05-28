const consultaController = require('../controllers/consultaController.js');

module.exports = app => {    
    app.get('/consulta', consultaController.getAtendimentos);
    app.post('/consulta', consultaController.postAtendimento);
}