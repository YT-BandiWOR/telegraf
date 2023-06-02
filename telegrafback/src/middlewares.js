const jwt = require("jsonwebtoken");
const config = require("./config");
const {dbQuery} = require("./dbfunctions");


const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ ok: false });
    }

    const formatted_token = token.split(' ')[1];

    try {
        const decodedToken = await jwt.verify(formatted_token, config.accessTokenSecret);

        if (decodedToken.exp < (Date.now() / 1000)) {
            return res.status(401).json({ ok: false, error: 'Время жизни токена истекло.' });
        }

        try {
            const query = await dbQuery('SELECT * FROM users WHERE id = $1', [decodedToken.userId]);
            const user = query.rows[0];

            if (!user.loggedin) {
                return res.status(401).json({ok: false, error: 'Требуется авторизация.'});
            }
            req.user = user;

        } catch (error) {
            return res.status(500).json({ok: false});
        }

        next();

    } catch (error) {
        return res.status(401).json({ ok: false });
    }
};


module.exports = {
    authMiddleware
}