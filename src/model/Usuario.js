const bcrypt = require('bcrypt');
const logger = require('../storage/logger.js');
const pool = require('../config/customConnection.js');
const ICrud = require('../interfaces/ICrud.js');
const contato = require('./Contato.js');
const { error } = require('winston');

class Usuario extends ICrud {
  constructor() {
    super();
  }


  async insert(usuario) {
    //Verifica se cpf existe na base antes de cadastrar.
    const { cpf } = usuario;

    const resultConsultaCpf = await this.consultaCpf(cpf);

    if (resultConsultaCpf.length > 0) {
      logger.warn(`Este cpf já consta na base ${cpf}`);
      return false;
    }

    //Preparação da query
    const sql = `
      INSERT INTO usuarios (nome_completo, cpf, senha)
      VALUES (?, ?, ?)
    `;

    let connection;

    try {
      // Criptografar senha
      const senhaCriptografada = await this.criptografarSenha(usuario.senha);

      if (!senhaCriptografada) {
        return false;
      }

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const resultInsert = await connection.execute(sql, [
        usuario.nome_completo,
        usuario.cpf,
        senhaCriptografada
      ]);

      const insertId = resultInsert[0].insertId;

      const resultContato = await contato.insert(connection, usuario.contato, insertId);
      if (!resultContato) {
        throw new Error();
      }

      // Consulta o usuário usando a MESMA conexão dentro da transação
      const [rows] = await connection.execute(
       ` SELECT * FROM usuarios u
            LEFT JOIN contatos c ON c.id_user = u.id
              WHERE u.id = ? AND u.deleted_at IS NULL`,
        [insertId]
      );

      await connection.commit();
      logger.info('Usuário cadastrado com sucesso');

      //Remover retorno da senha
      delete rows[0].senha

      return rows[0]; 
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }

      logger.error('Erro ao cadastrar usuário: ' + error.message);
      return false;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async select(sql, params) {
    try {
      const [rows] = params
        ? await pool.query(sql, params)
        : await pool.query(sql);

      logger.info('Consulta a base efetuada com sucesso');

      return rows;
    } catch (error) {
      logger.error('Erro ao consultar usuário: ' + error.message);
      return false;
    }
  }

  async update(usuario) {
    //Verifica se cpf existe na base antes de cadastrar.
    const { cpf, senha, ...dadosParaAtualizar } = usuario;
    const resultConsultaCpf = await this.consultaCpf(cpf);

    if (!resultConsultaCpf || resultConsultaCpf.length === 0) {
      logger.warn(`Este CPF não consta na base: ${cpf}`);
      return false;
    }

    //Criptografar Senha
    if (senha) {
      try {
        const senhaCriptografada = await this.criptografarSenha(senha);
        dadosParaAtualizar.senha = senhaCriptografada;
      } catch (err) {
        logger.error('Erro ao criptografar senha no update: ' + err.message);
        return false;
      }
    }

    // Gera dinamicamente os campos a serem atualizados
    const campos = Object.keys(dadosParaAtualizar);
    const valores = Object.values(dadosParaAtualizar);

    if (campos.length === 0) {
      logger.warn('Nenhum campo enviado para atualização');
      return false;
    }

    const setClause = campos.map(campo => `${campo} = ?`).join(', ');

    const sql = `
      UPDATE usuarios u
      SET ${setClause}
      WHERE u.cpf = ?;
    `;

    let connection;

    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      await connection.execute(sql, [...valores, cpf]);

      await connection.commit();
      logger.info(`Usuário com CPF ${cpf} atualizado com sucesso.`);

      //Retorno registro
      let dataUsuario = await this.consultaCpf(cpf);
      delete dataUsuario[0].senha;

      return dataUsuario;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }

      logger.error('Erro ao atualizar usuário: ' + error.message);
      return false;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async delete(cpf) {
    //Verifica se cpf existe na base antes de cadastrar.
    const resultConsultaCpf = await this.consultaCpf(cpf);

    if (!resultConsultaCpf || resultConsultaCpf.length === 0) {
      logger.warn(`Este CPF não consta na base: ${cpf}`);
      return false;
    }

    let connection;

    try {
      const idUser = resultConsultaCpf[0].id;

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const now = new Date();

      //delete em ordem ordem de depencia: consultas -> pets -> contatos -> usuario
      // CONSULTAS
      await this.softDeleteUserConsulta(connection, now, idUser);
      // PETS
      await this.softDeleteUserPet(connection, now, idUser);
      // CONTATOS
      await this.softDeleteUserContato(connection, now, idUser);

      // USUÁRIO
      await connection.execute(
        `UPDATE usuarios SET deleted_at = ? WHERE id = ?`,
        [now, idUser]
      );

      await connection.commit();
      logger.info(`Soft delete realizado com sucesso para CPF ${cpf}`);
      return idUser;

    } catch (error) {
      if (connection) await connection.rollback();
      logger.error(`Erro ao deletar dados do Usuario:  ${error.message}`);
      return false;

    } finally {
      if (connection) connection.release();
    }
  }

  async softDeleteUserConsulta(connection, now, idUser) {
    try {
      await connection.execute(
        `UPDATE consultas SET deleted_at = ? WHERE id_user = ?`,
        [now, idUser]
      );

      logger.info('Dados da consulta deletados');
      return true;

    } catch (error) {
      logger.error(`Erro ao deletar dados da consulta:  ${error.message}`);
      throw error;
    }
  }

  async softDeleteUserPet(connection, now, idUser) {
    try {
      await connection.execute(
        `UPDATE pets SET deleted_at = ? WHERE id_user = ?`,
        [now, idUser]
      );

      logger.info('Dados do pet deletados');
      return true;
    } catch (error) {
      logger.error(`Erro ao deletar dados do pet:  ${error.message}`);
      throw error
    }
  }

  async softDeleteUserContato(connection, now, idUser) {
    try {
      await connection.execute(
        `UPDATE contatos SET deleted_at = ? WHERE id_user = ?`,
        [now, idUser]
      );

      logger.info('Dados de contato deletados');
      return true;

    } catch (error) {
      logger.error(`Erro ao deletar dados do contato:  ${error.message}`);
      throw error;
    }
  }

  async consultaCpf(cpf) {
    const sql = `
        SELECT * FROM usuarios u WHERE u.cpf = ? AND u.deleted_at IS NULL;
    `;
    return await this.select(sql, [cpf]);
  }

  async getUser(id) {
    const sql = `
      SELECT * FROM usuarios u WHERE u.id = ? AND u.deleted_at IS NULL;
    `;
    return await this.select(sql, [id]);
  }

  async criptografarSenha(senha) {
    if (!senha) return false;
    const saltRounds = 10;
    try {
      logger.info('Senha criptografada');
      return await bcrypt.hash(senha, saltRounds);
    } catch (error) {
      logger.error('Erro ao criptografar senha ' + error.message);
      return false;
    }
  }
}

module.exports = new Usuario();
