const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3');
const { promisify } = require('util');
const bcrypt = require('bcrypt');
const validator = require('validator');
const roles = require("./roles");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('../database.db'); // Используем базу данных SQLite в памяти для примера. Можно изменить на путь к файлу базы данных.
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));

const accessTokenExpiry = '5m';
const accessTokenSecret = 'MySuperAccessTokenSecretKey1488and228';
const refreshTokenExpiry = '30d';
const refreshTokenSecret = 'MySuperRefreshTokenSecretKey911andZ';

const min_username_len = 4;
const min_password_len = 8;


// Создаем таблицу пользователей в базе данных
dbRun('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT, refreshToken TEXT, role TEXT)');

// Регистрация пользователя
app.post('/register', async (req, res) => {
    const { username = '', password = '', email = '' } = req.body;

    try {
        if (!validator.default.isEmail(email)) {
            return res.status(401).json({ok: false, error: 'Невалидный email-адрес.'});
        }

        if (username.length < min_username_len) {
            return res.status(401).json({ok: false, error: 'Невалидное имя пользователя.'});
        }

        if (password.length < min_password_len) {
            return res.status(401).json({ok: false, error: 'Невалидный пароль.'});
        }

        // Проверяем, существует ли пользователь с таким же именем
        const existingUser = await dbGet('SELECT id FROM users WHERE username = ? OR email = ?', username, email);
        if (existingUser) {
            return res.status(409).json({ ok: false, error: 'Пользователь с таким именем уже существует.' });
        }

        // Хешируем пароль
        const hashedPassword = await bcrypt.hash(password, 10);

        const role = roles.roleNames.user;

        // Создаем нового пользователя
        await dbRun('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', username, email, hashedPassword, role);

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
        let user;

        if (username) {
            user = await dbGet('SELECT id, username, password FROM users WHERE username = ?', username);
        } else if (email) {
            user = await dbGet('SELECT id, username, password FROM users WHERE email = ?', email);
        }

        if (!user) {
            return res.status(401).json({ ok: false, error: 'Пользователь с этим именем не найден.' });
        }

        // Проверяем соответствие хеша пароля
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ ok: false, error: 'Неверный пароль.' });
        }

        // Генерируем JWT-токен
        const token = jwt.sign({ userId: user.id, username: user.username }, accessTokenSecret, { expiresIn: accessTokenExpiry });

        // Обновляем рефреш-токен в базе данных
        const refreshToken = jwt.sign({ userId: user.id, username: user.username }, refreshTokenSecret, { expiresIn: refreshTokenExpiry });
        await dbRun('UPDATE users SET refreshToken = ? WHERE id = ?', refreshToken, user.id);

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
        // Проверяем, валиден ли рефреш-токен
        const decoded = jwt.verify(refreshToken, refreshTokenSecret);

        // Проверяем наличие рефреш-токена в базе данных
        const user = await dbGet('SELECT id, username FROM users WHERE id = ? AND refreshToken = ?', decoded.userId, refreshToken);
        if (!user) {
            return res.status(401).json({ ok: false, error: 'Неверный токен обновления.' });
        }

        // Генерируем новый JWT-токен
        const newToken = jwt.sign({ userId: user.id, username: user.username }, accessTokenSecret, { expiresIn: accessTokenExpiry });

        res.json({ ok: true, token: newToken });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(401).json({ ok: false });
    }
});

// Разавторизация
app.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;

    try {
        // Удаляем рефреш-токен из базы данных
        await dbRun('UPDATE users SET refreshToken = NULL WHERE refreshToken = ?', refreshToken);

        res.json({ ok: true });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ ok: false });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
