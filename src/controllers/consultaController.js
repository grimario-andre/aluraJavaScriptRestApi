const consultas = require("../model/Consulta.js");

module.exports = {    
    getAtendimentos(req, res) {
        // res.send('Hello, Express + Node v14!');
        res.status(200).json(consultas);
    },

    postAtendimento(req, res) {    
        atendimentos.push(req.body);
        res.status(200).send('created');
    }
}
