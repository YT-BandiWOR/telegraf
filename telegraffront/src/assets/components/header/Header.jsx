import React, {useEffect, useState} from 'react';
import cls from "./Header.module.scss";
import {Link} from "react-router-dom";
import useCookie from "../../hooks/useCookie.js";

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

function HeaderLinks({links, accountInfo}) {
    const account = accountInfo ?
        (
            <Link to={'/account'}>{accountInfo.username}</Link>
        )
        :
        (
            <Link to={'/login'}>Войти</Link>
        )

    return (
        <div className={cls.links}>
            {
                links.map((element) => (
                    <Link to={element.url} key={element.id}>{element.text}</Link>
                ))
            }
            {account}
        </div>
    );
}

const Header = ({account}) => {
    const links = [
        {text: 'Чаты', url: '/chats', id: 1},
        {text: 'Инфо', url: '/info', id: 2},
    ];
    const logoName = 'Telegraf';

    return (
        <header className={cls.header}>
            <HeaderLogo logoName={logoName}/>
            <HeaderLinks links={links} accountInfo={account}/>
        </header>
    );
};

export default React.memo(Header);