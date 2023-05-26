import React from 'react';
import cls from "./Footer.module.scss";

const Footer = () => {
    return (
        <footer className={cls.footer}>
            Все права сайта защищены &copy;
        </footer>
    );
};

export default Footer;