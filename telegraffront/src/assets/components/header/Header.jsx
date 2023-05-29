import React, { useState } from 'react';
import cls from './Header.module.scss';
import { Link } from 'react-router-dom';

function HeaderLogo({ logoName }) {
    return (
        <Link to="/" className={cls.logo}>
            <div className={cls.logo_icon} />
            <div className={cls.logo_name}>{logoName}</div>
        </Link>
    );
}

function HeaderLinks({ links, accountInfo, opened, setOpened }) {
    const account = accountInfo ? (
        <Link to="/account">{accountInfo.username}</Link>
    ) : (
        <Link to="/login">Войти</Link>
    );

    if (opened) {
        return (
            <div className={cls.links}>
                {links.map((element) => (
                    <Link to={element.url} key={element.id}>
                        {element.text}
                    </Link>
                ))}
                {account}
                <button onClick={()=>setOpened(false)}>Закрыть</button>
            </div>
        );
    } else {
        return null;
    }
}

function HeaderOpenLinks({ setOpened }) {
    return (
        <div
            className={cls.open_links}
            onClick={() => setOpened((prevState) => !prevState)}
        />
    );
}

const Header = ({ account }) => {
    const links = [
        { text: 'Чаты', url: '/chats', id: 1 },
        { text: 'Инфо', url: '/info', id: 2 },
    ];
    const logoName = 'Telegraf';
    const [opened, setOpened] = useState(window.screen.width > 600);

    return (
        <header className={cls.header}>
            <HeaderLogo logoName={logoName} />
            <HeaderLinks opened={opened} setOpened={setOpened} links={links} accountInfo={account} />
            <HeaderOpenLinks setOpened={setOpened} />
        </header>
    );
};

export default React.memo(Header);
