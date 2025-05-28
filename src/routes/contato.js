const contatosController = require('../controllers/usuarioController.js');

module.exports = app => {
    app.get('/cotnato/read/:cpf', contatosController.readUsuario);
    app.put('/cotnato/update/:cpf', contatosController.updateUsuario);
    app.delete('/cotnato/delete/:cpf', contatosController.deleteUsuario);
}