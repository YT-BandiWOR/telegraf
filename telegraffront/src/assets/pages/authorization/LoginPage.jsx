import React, {useState} from 'react';
import cls from "./Authorization.module.scss";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
        <main className={cls.auth_page}>
            <form className={cls.auth_form}>
                <h1 className={cls.caption}>Авторизация</h1>
                <input type="text" id={'name'} className={cls.input_field} placeholder={'Имя пользователя'}  value={username} onChange={ev=>setUsername(ev.target.value)}/>
                <input type="password" id={'password'} className={cls.input_field} placeholder={'Пароль'}  value={password} onChange={ev=>setPassword(ev.target.value)}/>
                <button type={"submit"} className={cls.submit_button}>Регистрация</button>
            </form>
        </main>
    );
};

export default LoginPage;