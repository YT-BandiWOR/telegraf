import React, { useState } from 'react';
import cls from "./Authorization.module.scss";
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import FullscreenModal from "../../components/modal/FullscreenModal.jsx";
import afterAuthRedirectUrl from "../../utils/afterAuthRedirectUrl.ts";
import useStorage from "../../hooks/storage.ts";
import telegrafAPI from "../../api/telegrafAPI.ts";

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onFormSubmit = (ev) => {
        ev.preventDefault();

        if (password !== repeatPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        const registerRequest = async () => {
            try {
                await telegrafAPI().register(username, email, password);

                useStorage(sessionStorage).set('reg_data', {username, password});
                setLoading(false);

                navigate('/login');

            } catch (error) {
                setLoading(false);
                setError(error.data);
                console.error(error);
            }
        }

        registerRequest();
    };

    return (
        <main className={cls.auth_page}>
            <FullscreenModal isOpened={loading}/>
            <form className={cls.auth_form} onSubmit={onFormSubmit}>
                <h1 className={cls.caption}>Регистрация</h1>
                <input type="text" id={'name'} className={cls.input_field} placeholder={'Имя пользователя'} value={username} onChange={ev => setUsername(ev.target.value)} />
                <input type="email" id={'email'} className={cls.input_field} placeholder={'Электронная почта'} value={email} onChange={ev => setEmail(ev.target.value)} />
                <input type="password" id={'password'} className={cls.input_field} placeholder={'Ваш пароль'} value={password} onChange={ev => setPassword(ev.target.value)} />
                <input type="password" id={'repeatPassword'} className={cls.input_field} placeholder={'Повтор пароля'} value={repeatPassword} onChange={ev => setRepeatPassword(ev.target.value)} />
                <div className={cls.buttons}>
                    <Link className={cls.switch_auth_type} to={'/login'}>Войти</Link>
                    <button type={"submit"} className={cls.submit_button}>Регистрация</button>
                </div>

                {
                    error && (
                        <div className={cls.error_container}>{error.error || error}</div>
                    )
                }
            </form>
        </main>
    );
};

export default RegistrationPage;
