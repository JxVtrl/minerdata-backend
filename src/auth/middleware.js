const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'chave-secreta-top';

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"
    if (!token) return res.status(401).json({ error: 'Token não fornecido' });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });

        req.user = user;
        next();
    });
};
