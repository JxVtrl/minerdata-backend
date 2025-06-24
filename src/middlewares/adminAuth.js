const { verifyToken } = require('../utils/jwt');

module.exports = function adminAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Formato de autorização inválido' });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = verifyToken(token);

        // Verifica se o usuário é admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error.message);
        return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
}; 