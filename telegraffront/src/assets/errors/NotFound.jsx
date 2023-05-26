import React from 'react';
import cls from "./ErrorPage.module.scss";

const NotFound = () => {
    return (
        <main className={cls.page}>
            <h1>Ошибка <span style={{color: 'red'}}>404</span></h1>
            <p className={cls.error}>Страница по запросу не найдена.</p>
            <p className={cls.description}>Проверьте, корректен ли URL-адрес в поле поиска, либо обратитесь к администратору сайта за дополнительной информацией.</p>
        </main>
    );
};

export default NotFound;