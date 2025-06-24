const jwt = require('jsonwebtoken');

const USERS = [
    { id: 1, username: 'joao', password: '123456' }, // simulação de "banco de dados"
];

const SECRET = process.env.JWT_SECRET || 'chave-secreta-top';

exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = USERS.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '2h' });
    res.json({ token });
};

exports.verifyToken = (req, res) => {
    res.json({ ok: true, user: req.user });
};
