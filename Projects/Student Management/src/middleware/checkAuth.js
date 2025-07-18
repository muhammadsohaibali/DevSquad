const { getDB, writeDB } = require('../config/db')

function tokenParser(token) {
    try {
        const parts = token.split(';');
        if (parts.length !== 2) return null;

        const usernamePart = parts[0].split(':');
        const passwordPart = parts[1].split(':');

        if (usernamePart[0] !== 'username' || passwordPart[0] !== 'password') return null;

        return {
            username: usernamePart[1],
            password: passwordPart[1]
        }
    } catch (error) {
        return null
    }
}

function checkAuth(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        if (!next) return false
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decodedToken = tokenParser(token)
    if (!decodedToken || !decodedToken.username || !decodedToken.password) {
        if (!next) return false
        return res.status(401).json({ success: false, error: 'Invalid token' })
    }

    const users = getDB()
    const user = users.find(u => u.username === decodedToken.username && !u.deleted);

    if (!user) {
        if (!next) return false
        return res.status(404).json({ success: false, error: 'User Not Found' })
    }

    if (user.password !== decodedToken.password) {
        if (!next) return false
        return res.status(404).json({ success: false, error: 'Invalid Credentials' })
    }

    req.user = user

    if (!next) return true
    next()
}

module.exports = checkAuth
