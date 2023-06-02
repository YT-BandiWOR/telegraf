const accessTokenExpiry = '5m';
const accessTokenSecret = 'MySuperAccessTokenSecretKey1488and228';
const refreshTokenExpiry = '30d';
const refreshTokenSecret = 'MySuperRefreshTokenSecretKey911andZ';
const min_username_len = 4;
const min_password_len = 8;

const args = process.argv.slice(2);
const host = args[0] || 'localhost';
const port = args[1] || 3000;


module.exports = {
    accessTokenExpiry,
    accessTokenSecret,
    refreshTokenExpiry,
    refreshTokenSecret,
    min_username_len,
    min_password_len,
    host,
    port
}