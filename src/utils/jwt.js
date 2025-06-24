const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'minerdata_secret';

function generateToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '2h' });
}

function verifyToken(token) {
    try {
        // Validações básicas
        if (!token || typeof token !== 'string') {
            throw new Error('Token inválido: deve ser uma string');
        }

        // Remove espaços em branco, quebras de linha e caracteres especiais
        let cleanToken = token.trim();

        // Remove possíveis caracteres de controle
        cleanToken = cleanToken.replace(/[\x00-\x1F\x7F]/g, '');

        // Verifica se o token tem o formato correto (3 partes separadas por ponto)
        const parts = cleanToken.split('.');
        if (parts.length !== 3) {
            throw new Error('Token malformado: deve ter 3 partes');
        }

        // Verifica se cada parte é uma string válida
        for (let i = 0; i < parts.length; i++) {
            if (!parts[i] || parts[i].length === 0) {
                throw new Error(`Parte ${i + 1} do token está vazia`);
            }
        }

        return jwt.verify(cleanToken, secret);
    } catch (error) {
        console.error('Erro na verificação do token:', error.message);
        throw error;
    }
}

module.exports = { generateToken, verifyToken };
