const Usuario = require('../model/Usuario.js');
const Joi = require('joi');

module.exports = {
    async createUsuario(req, res) {
        //Validação inputs
        const schema = Joi.object({
            nome_completo: Joi.string().min(3).required(),
            cpf: Joi.string().length(14).required(), // formato com pontos e traço: 000.000.000-00
            senha: Joi.string().min(4).required(),
            contato: Joi.object({
                numero_telefone: Joi.string().min(14).required(),
                email: Joi.string().email().allow(null, ''),
            })
        });

        // Supondo que req.body tenha os dados
        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(422).json({ success: false, message: error.details[0].message });
        }

        const dadosUsuario = value;
        const resultRegistro = await Usuario.insert(dadosUsuario);
        return res.json(resultRegistro);
        if (!resultRegistro) {
            return res.status(400).json({ success: false, message: 'Erro ao cadastrar usuário!' });
        }

        return res.status(201).json({ success: true, data: resultRegistro });
    },

    async readUsuario(req, res) {
        const cpf = req.params.cpf;

        const resultadoCosulta = await Usuario.getUser(cpf);

        if (!resultadoCosulta) {
            return res.status(400).json({ success: false, message: 'Erro ao consultar usuário!' });
        }

        return res.status(201).json({ success: true, data: resultadoCosulta });
    },

    async updateUsuario(req, res) {
        //Validação inputs
        const cpfSchema = Joi.string().length(14).required().label('Cpf');

        const { error: cpfError } = cpfSchema.validate(req.params.cpf);
        if (cpfError) {
            return res.status(400).json({ success: false, message: cpfError.details[0].message });
        }

        const schema = Joi.object({
            nome_completo: Joi.string().min(3).required(),
            senha: Joi.string().min(4).required(),
        });

        // Supondo que req.body tenha os dados
        const { error: bodyError, value } = schema.validate(req.body);

        if (bodyError) {
            return res.status(400).json({ success: false, message: bodyError.details[0].message });
        }

        const dadosUsuario = value;
        dadosUsuario.cpf = req.params.cpf;
        
        const resultAlteracaoRegistro = await Usuario.update(dadosUsuario);
        
        if (!resultAlteracaoRegistro) {
            return res.status(400).json({ success: false, message: 'Erro ao atualizar usuário!' });
        }

        return res.status(200).json({resultAlteracaoRegistro});
    },

    async deleteUsuario(req, res) {
        //Executar soft delete

        //Validação inputs
        const cpfSchema = Joi.string().length(14).required().label('Cpf');

        const { error: cpfError } = cpfSchema.validate(req.params.cpf);
        if (cpfError) {
            return res.status(400).json({ success: false, message: cpfError.details[0].message });
        }

        const resultExlusaoRegistro = await Usuario.update(dadosUsuario);

        if (!resultExlusaoRegistro) {
            return res.status(400).json({ success: false, message: 'Erro ao deletar usuário!' });
        }

        return res.status(204).json({ success: true, data: idUser });

    }
}