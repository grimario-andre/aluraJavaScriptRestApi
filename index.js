require('dotenv').config();
const logger = require('./src/storage/logger');
const pool = require('./src/config/customConnection');
const customExpress = require('./src/config/customExpress');
const CreateTables  = require('./src/database/CreateTables.js');

const app = customExpress();
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    logger.info('Conectando ao banco...');
    const connection = await pool.getConnection();
    await connection.ping();
   
    const tables = new CreateTables(connection);
    await tables.init();

    connection.release();

    app.listen(PORT, () => {
      logger.info(`Server online http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Erro ao iniciar a aplicação:', err); // Agora com stack completa
    process.exit(1);
  }
})();


