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

function checkGuest(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        if (!next) return true
        return next()
    };

    const decodedToken = tokenParser(token);
    if (!decodedToken || !decodedToken.username || !decodedToken.password) {
        if (!next) return true
        return next()
    }

    const users = getDB();
    const user = users.find(u =>
        u.username === decodedToken.username &&
        u.password === decodedToken.password &&
        !u.deleted
    );

    if (user) {
        return res.status(403).json({ success: false, error: 'Already logged in' });
    }
    if (!next) return false
    next()
}
