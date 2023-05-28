import React, {useEffect, useState} from 'react';
import cls from "./Authorization.module.scss";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import FullscreenModal from "../../components/modal/FullscreenModal.jsx";
import useCookie from "../../hooks/useCookie.js";
import useStorage from "../../hooks/useStorage.js";
import telegrafAPI from "../../api/telegrafAPI.js";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const reg_data = useStorage(sessionStorage).pop('reg_data');

        if (reg_data && reg_data.username && reg_data.password) {
            setUsername(reg_data.username);
            setPassword(reg_data.password);
        }
    }, [])

    const onFormSubmit = async (ev) => {
        ev.preventDefault();
        setLoading(true);

        try {
            const response = await telegrafAPI('http://localhost:3000').login(username, password);
            useCookie().setToken('access_token', response.token);
            useStorage().setToken('refresh_token', response.refreshToken);

            location.replace(location.origin + '/');

        } catch (error) {
            console.log(error);
            setError(error.data.error);
        }

        setLoading(false);
    }

    return (
        <>
            <FullscreenModal isOpened={loading}/>
            <main className={cls.auth_page}>
                <form className={cls.auth_form} onSubmit={onFormSubmit}>
                    <h1 className={cls.caption}>Авторизация</h1>
                    <input type="text" id={'name'} className={cls.input_field} placeholder={'Имя пользователя'}  value={username} onChange={ev=>setUsername(ev.target.value)}/>
                    <input type="password" id={'password'} className={cls.input_field} placeholder={'Пароль'}  value={password} onChange={ev=>setPassword(ev.target.value)}/>
                    <div className={cls.buttons}>
                        <Link className={cls.switch_auth_type} to={'/register'}>Регистрация</Link>
                        <button type={"submit"} className={cls.submit_button}>Войти</button>
                    </div>

                    {
                        error && (
                            <div className={cls.error_container}>{error.error || error}</div>
                        )
                    }
                </form>
            </main>
        </>
    );
};

export default LoginPage;