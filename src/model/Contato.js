const logger = require('../storage/logger.js');
const pool = require('../config/customConnection.js');
const ICrud = require('../interfaces/ICrud.js');

class Contato extends ICrud {
  constructor() {
    super();
  }

  async insert(connection, contato, id_user) {
    const { numero_telefone, email } = contato;
    
    const sql = `
        INSERT INTO contatos (numero_telefone, email, id_user)
        VALUES (?, ?, ?)
    `;

    try {
      const result = await connection.execute(sql, [
        numero_telefone,
        email,
        id_user
      ]);

      logger.info('Contato do usuario cadastrado');
      return result;
    } catch (error) {
      logger.error('Erro ao cadastrar contato do usuário: ' + error.message);
      return false;
    }

  }
}

module.exports = new Contato();
