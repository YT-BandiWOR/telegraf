const {dbQuery} = require("./dbfunctions");
const {ChatType} = require("./types");
const {generateRandomString} = require("./tools");

const NullRows = {rows: []};

const dbTables = {
    "users": "id SERIAL PRIMARY KEY, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT, refreshtoken TEXT, role TEXT, registrationtime TEXT, loggedin INTEGER",
    "chats": "id SERIAL PRIMARY KEY, userid INTEGER, chatid INTEGER, type TEXT, securekey TEXT",
    "messages": "id SERIAL PRIMARY KEY, chatid INTEGER, text TEXT, replytoid INTEGER",
}

const createTables = () => {
    for (const table_name in dbTables) {
        const db_fields = dbTables[table_name];

        dbQuery(`CREATE TABLE IF NOT EXISTS ${table_name} (${db_fields})`)
            .then(() => {
                console.log(`Table "${table_name}" created successfully`);
            })
            .catch(error => {
                console.error(`Error creating table "${table_name}"`, error);
            });
    }
}

const createUser = async (username, email, hashedPassword, role, loggedIn, registrationTime) => {
    return await dbQuery('INSERT INTO users (username, email, password, role, loggedin, registrationtime) VALUES ($1, $2, $3, $4, $5, $6)',
        [username, email, hashedPassword, role, loggedIn, registrationTime]);
}

const getUser = async (email, username) => {
    if (username) {
        return await dbQuery('SELECT id, username, password FROM users WHERE username = $1', [username]);
    } else if (email) {
        return await dbQuery('SELECT id, username, password FROM users WHERE email = $1', [email]);
    }

    return NullRows;
}

const loginUser = async (userId, refreshToken, loggedIn) => {
    return await dbQuery('UPDATE users SET refreshtoken = $1, loggedin = $2 WHERE id = $3', [refreshToken, loggedIn, userId]);
}

const getUserByIdAndRefreshToken = async (userId, refreshToken) => {
    return await dbQuery('SELECT id, username, loggedin FROM users WHERE id = $1 AND refreshtoken = $2', [userId, refreshToken]);
}

const getUserByUsernameOrEmail = async (username, email) => {
    return await dbQuery('SELECT id FROM users WHERE username = $1 OR email = $2', [username, email]);
}

const logoutUser = async (refreshToken) => {
    return await dbQuery('UPDATE users SET refreshtoken = NULL, loggedin = $1 WHERE refreshtoken = $2', [0, refreshToken]);
}

const deleteUser = async (userId, refreshToken) => {
    return await dbQuery('DELETE FROM users WHERE id = $1 AND refreshtoken = $2', [userId, refreshToken]);
}

const getPrivateByUsersId = async (userId, chatId) => {
    return await dbQuery('SELECT * FROM chats WHERE userid = $1 AND chatid = $2 AND type = $3', [userId, chatId, ChatType.PRIVATE]);
}

const createChat = async (userId, chatId, type) => {
    const secureKey = generateRandomString(16);

    const result =  await dbQuery('INSERT INTO chats (userid, chatid, type, securekey) VALUES ($1, $2, $3, $4) RETURNING id', [
        userId, chatId, type, secureKey
    ]);

    if (result && result.rows && result.rows.length > 0) {
        return result.rows[0];
    }

    throw new Error('Failed to get inserted data');
}


module.exports = {
    createTables,
    createUser,
    getUser,
    loginUser,
    getUserByIdAndRefreshToken,
    getUserByUsernameOrEmail,
    logoutUser,
    deleteUser,
    getPrivateByUsersId,
    createChat,
}