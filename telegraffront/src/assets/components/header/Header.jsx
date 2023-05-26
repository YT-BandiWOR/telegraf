import React from 'react';
import cls from "./Header.module.scss";
import {Link} from "react-router-dom";

function HeaderLogo({logoName}) {
    return (
        <Link to={'/'} className={cls.logo}>
            <div className={cls.logo_icon}/>
            <div className={cls.logo_name}>
                {logoName}
            </div>
        </Link>
    );
}

function HeaderLinks({links}) {
    return (
        <div className={cls.links}>
            {
                links.map((element) => (
                    <Link to={element.url} key={element.id}>{element.text}</Link>
                ))
            }
        </div>
    );
}

const Header = () => {
    const links = [
        {text: 'Чаты', url: '/chats', id: 1},
        {text: 'Инфо', url: '/info', id: 2},
        {text: 'Аккаунт', url: '/account', id: 3},
        {text: 'Авторизация', url: '/login', id: 4},
        {text: 'Регистрация', url: '/register', id: 5},
    ];

    const logoName = 'Telegraf';

    return (
        <header className={cls.header}>
            <HeaderLogo logoName={logoName}/>
            <HeaderLinks links={links}/>
        </header>
    );
};

export default Header;