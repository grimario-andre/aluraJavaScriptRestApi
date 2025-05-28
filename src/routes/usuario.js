const usuariosController = require('../controllers/usuarioController.js');

module.exports = app => {
    app.post('/usuario/create', usuariosController.createUsuario);
    app.get('/usuario/read/:cpf', usuariosController.readUsuario);
    app.put('/usuario/update/:cpf', usuariosController.updateUsuario);
    app.delete('/usuario/delete/:cpf', usuariosController.deleteUsuario);
}