import React, {useEffect, useState} from 'react';
import cls from "./Authorization.module.scss";
import {Link, useNavigate} from "react-router-dom";
import FullscreenModal from "../../components/modal/FullscreenModal.jsx";
import cookie from "../../hooks/cookie.ts";
import storage from "../../hooks/storage.ts";
import telegrafAPI from "../../api/telegrafAPI.ts";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const reg_data = storage(sessionStorage).pop('reg_data');

        if (reg_data && reg_data.username && reg_data.password) {
            setUsername(reg_data.username);
            setPassword(reg_data.password);
        }
    }, [])

    const onFormSubmit = (ev) => {
        ev.preventDefault();
        setLoading(true);

        const loginRequest = async () => {
            try {
                const response = await telegrafAPI().login(username, password);
                console.log('res', response.data)

                cookie().setToken('access_token', response.data.token);
                storage().setToken('refresh_token', response.data.refreshToken);

                location.replace(location.origin + '/');

            } catch (error) {
                console.error(error);
                setError(error?.data);
            }

            setLoading(false);
        }

        loginRequest();
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