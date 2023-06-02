const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const roles = require("./roles");
const config = require("./config")
const {dbQuery} = require("./dbfunctions");
const middlewares = require("./middlewares");
const tables = require("./tables");
const types = require("./types");
const tokens = require("./tokens");
const tools = require("./tools");
const {ChatType} = require("./types");
const {inspect} = require("util");

const app = express();
app.use(express.json());
app.use(cors());

tables.createTables();


app.post('/register', async (req, res) => {
    const { username = '', password = '', email = '' } = req.body;

    try {
        if (!validator.default.isEmail(email)) {
            return res.status(401).json({ok: false, error: 'Невалидный email-адрес.'});
        }

        if (username.length < config.min_username_len) {
            return res.status(401).json({ok: false, error: 'Невалидное имя пользователя.'});
        }

        if (password.length < config.min_password_len) {
            return res.status(401).json({ok: false, error: 'Невалидный пароль.'});
        }

        const existingUser = await tables.getUserByUsernameOrEmail(username, email);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ ok: false, error: 'Пользователь с таким именем или email уже существует.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = roles.roleNames.user;
        const loggedIn = 0;
        const registrationTime = Math.floor(Date.now());

        await tables.createUser(username, email, hashedPassword, role, loggedIn, registrationTime);
        res.status(201).json({ ok: true });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ ok: false });
    }
});

// Авторизация пользователя
app.post('/login', async (req, res) => {
    const { username = '', email = '', password } = req.body;

    try {
        const userQuery = await tables.getUser(email, username);
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ ok: false, error: 'Пользователь с этим именем не найден.' });
        }
        const user = userQuery.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ ok: false, error: 'Неверный пароль.' });
        }

        const token = tokens.signAccessToken(user.id, user.username);
        const refreshToken = tokens.signRefreshToken(user.id, user.username);
        await tables.loginUser(user.id, refreshToken, 1);

        res.json({ ok: true, token, refreshToken });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ ok: false });
    }
});

// Обновление токена
app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const decodedRefreshToken = tokens.verifyRefreshToken(refreshToken);
        const userQuery = await tables.getUserByIdAndRefreshToken(decodedRefreshToken.userId, refreshToken);
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ ok: false, error: 'Неверный токен обновления.' });
        }

        const user = userQuery.rows[0];
        if (!user.loggedin) {
            return res.status(401).json({ok: false, error: 'Требуется авторизация.'})
        }

        const token = tokens.signAccessToken(user.id, user.username);

        res.json({ ok: true, token });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ ok: false });
    }
});

app.get('/me', middlewares.authMiddleware, async (req, res) => {
    res.status(200).json({ok: true, user: req.user});
})

// Разавторизация
app.post('/logout', middlewares.authMiddleware, async (req, res) => {
    const { refreshToken } = req.body;

    try {
        await tables.logoutUser(refreshToken);

        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ ok: false });
    }
});

app.post('/deleteAccount', middlewares.authMiddleware, async (req, res) => {
    const { refreshToken, password } = req.body;

    try {
        const passwordMatch = await bcrypt.compare(password, req.user.password);
        if (!passwordMatch) {
            return res.status(401).json({ ok: false, error: 'Неверный пароль.' });
        }

        await tables.deleteUser(req.user.id, refreshToken);

        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false});
    }
});

app.post("/getUserIdByName", middlewares.authMiddleware, async (req, res) => {
    const {username} = req.body;

    try {
        const searchedUserQuery = await tables.getUserByUsernameOrEmail(username, null);
        if (searchedUserQuery.rows.length === 0) {
            return res.status(404).json({ok: false, error: 'Пользователь не найден.'});
        }

        res.status(200).json({ok: true, userId: searchedUserQuery.rows[0].id});
    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false});
    }
})

app.post("/createPrivate", middlewares.authMiddleware, async (req, res) => {
    const {userId} = req.body;

    try {
        const existingChat = await tables.getPrivateByUsersId(req.user.id, userId);
        if (existingChat.rows.length > 0) {
            return res.status(409).json({ok: false, error: 'Чат с этим пользователем уже существует.'})
        }

        const privateId = await tables.createChat(req.user.id, userId, ChatType.PRIVATE);
        res.status(200).json({ok: true, privateId});

    } catch (error) {
        console.log(error);
        res.status(500).json({ok: false});
    }
});


app.listen(config.port, config.host, () => {
    console.log(`Server is running on ${config.host}:${config.port}`);
});

