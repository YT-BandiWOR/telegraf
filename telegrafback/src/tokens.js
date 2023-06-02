const jwt = require("jsonwebtoken");
const config = require("./config");

const signAccessToken = (userId, username) => {
    return jwt.sign({ userId, username }, config.accessTokenSecret, { expiresIn: config.accessTokenExpiry });
}

const signRefreshToken = (userId, username) => {
    return jwt.sign({ userId, username }, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiry });
}

const verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, config.refreshTokenSecret);
}

const verifyAccessToken = (token) => {
    return jwt.verify(token, config.accessTokenSecret);
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    verifyAccessToken
};