const logger = require('../storage/logger');
const poolMySQL = require('../config/customConnection.js');

(async () => {
  try {
    const connection = await poolMySQL.getConnection();
    await connection.ping();
    logger.info('Conexão com MySQL estabelecida com sucesso.');
    connection.release();
  } catch (err) {
    logger.error('Erro ao conectar ao MySQL:', err.message);
  }
})();

module.exports = poolMySQL;
