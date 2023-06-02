const {promisify} = require("util");
const {dbPool} = require("./dbpool");

const dbQuery = promisify(dbPool.query).bind(dbPool);


module.exports = {
    dbQuery
}
