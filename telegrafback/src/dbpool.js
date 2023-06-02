const {Pool} = require("pg");

const dbPool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydatabase',
    password: '1Kimonojoom1',
    port: 15432,
});

module.exports = {
    dbPool
}