require('dotenv').config();
const bcrypt = require('bcrypt');
const usuarios = require('../model/Usuario.js');

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

function generateToken(id, nome) {
    return jwt.sign(
        { id, nome },
        SECRET,
        { expiresIn: '1h' }
    );
}

module.exports = {
    async login(req, res) {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: missing user or password'
            });
        }

        const usuarioEncontrado = usuarios.find(usuario => usuario.nome === user);

        if (!usuarioEncontrado) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const senhaValida = await bcrypt.compare(password, usuarioEncontrado.senhaHash);

        if (!senhaValida) {
            return res.status(401).json({
                success: false,
                message: 'Credenciais inválidas',
            });
        }

        const token = generateToken(usuarioEncontrado.id, usuarioEncontrado.nome);

        return res.status(200).json({
            success: true,
            message: 'Login bem-sucedido',
            token: token
        });
    },

    async autenticacao(req, res, next) { 
        try {
            const authHeader = req.headers['authorization'];
            console.log(authHeader);
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ success: false, message: 'Token não fornecido' });
            }

            const token = authHeader.split(' ')[1];

            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: false, message: 'Token inválido ou expirado' });
                }

                req.user = {
                    id: decoded.id,
                    nome: decoded.nome
                };

                next(); // libera a requisição para o próximo handler/middleware
            });

        } catch (error) {
            return res.status(500).json({ success: false, message: 'Erro ao validar token' });
        }
    }
}