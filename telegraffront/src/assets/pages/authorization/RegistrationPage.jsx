import React, { useState } from 'react';
import cls from "./Authorization.module.scss";
import axios from 'axios';

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const onFormSubmit = async (ev) => {
        ev.preventDefault();

        setLoading(true);

        try {
            const result = await axios.post('http://localhost:3000/register', {
                username,
                password,
                email
            });

            setLoading(false);
            setResponse(result.data);
        } catch (error) {
            setLoading(false);
            setError(error.response.data);
        }
    };

    return (
        <main className={cls.auth_page}>
            <form className={cls.auth_form} onSubmit={onFormSubmit}>
                <h1 className={cls.caption}>Регистрация</h1>
                <input type="text" id={'name'} className={cls.input_field} placeholder={'Имя пользователя'} value={username} onChange={ev => setUsername(ev.target.value)} />
                <input type="email" id={'email'} className={cls.input_field} placeholder={'Электронная почта'} value={email} onChange={ev => setEmail(ev.target.value)} />
                <input type="password" id={'password'} className={cls.input_field} placeholder={'Ваш пароль'} value={password} onChange={ev => setPassword(ev.target.value)} />
                <input type="password" id={'repeatPassword'} className={cls.input_field} placeholder={'Повтор пароля'} value={repeatPassword} onChange={ev => setRepeatPassword(ev.target.value)} />
                <button type={"submit"} className={cls.submit_button}>Регистрация</button>

                {
                    error && (
                        <div className={cls.error_container}>{error.error}</div>
                    )
                }
            </form>
        </main>
    );
};

export default RegistrationPage;
