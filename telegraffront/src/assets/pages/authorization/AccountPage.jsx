import React, {useEffect, useState} from 'react';
import cls from "./Authorization.module.scss";
import {useNavigate} from "react-router-dom";
import FullscreenModal from "../../components/modal/FullscreenModal.jsx";
import telegrafAPI from "../../api/telegrafAPI";
import storage from "../../hooks/storage";
import cookie from "../../hooks/cookie";

const AccountPage = ({account}) => {
    const [loading, setLoading] = useState(false);
    const [logoutError, setLogoutError] = useState(null);
    const [deleteAccountError, setDeleteAccountError] = useState(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);

    const data = account ? [
        {name: 'ID Аккаунта', value: account.id, type: 'id'},
        {name: 'Имя пользователя', value: account.username, type: 'username'},
        {name: 'Почта', value: account.email, type: 'email'},
        {name: 'Роль', value: account.role, type: 'role'},
        {name: 'Хеш-Пароля', value: account.password, type: 'password'},
        {name: 'Токен обновления', value: account?.refreshtoken, type: 'refreshToken'},
        {name: 'Авторизован', value: (account.loggedin) ? 'Да' : 'Нет', type: 'loggedIn'},
        {name: 'Регистрация', value: (account.registrationtime) ? new Date(Number(account.registrationtime)).toLocaleString() : 'Неизвестно', type: 'registrationTime'},
    ] : [];

    const onChange = (ev, type) => {

    }

    const deleteAccount = () => {
        if (!deleteConfirmation) {
            setDeleteConfirmation(true);
            return;
        }

        setLoading(true);
        const deleteAccountRequest = async () => {
            try {
                await telegrafAPI().deleteAccount(confirmPassword);
                storage().remove('refresh_token');
                cookie().remove('access_token');
                location.replace('/');

            } catch (reqError) {
                setDeleteAccountError(true);
                setError(reqError.data);
                setLoading(false);
                setConfirmPassword('');
                setDeleteConfirmation(false);
            }
        }

        deleteAccountRequest();
    }

    const logout = () => {
        setLoading(true);

        const logoutRequest = async () => {
            try {
                await telegrafAPI().logout();
                storage().remove('refresh_token');
                cookie().remove('access_token');
                location.replace('/');

            } catch (reqError) {
                setLogoutError('Не удалось выйти из аккаунта.');
                setLoading(false);
            }
        }

        logoutRequest();
    }

    if (loading) return <FullscreenModal isOpened={true}/>
    return (
        <div className={cls.page}>
            <article>
                <h1>Мой аккаунт</h1>
                {
                    account ? (
                        data.map((value, index)=>(
                            <section key={index}>
                                <span>{value.name}</span>
                                <input type="text" value={value.value} onChange={(event)=>onChange(event, value.type)}/>
                            </section>
                        ))
                    ) : (
                        <div className={cls.requireAuth}>Необходима авторизация</div>
                    )
                }
                <hr/>
                <button className={cls.logout_button} onClick={logout}>{logoutError? 'Ошибка' : 'Выйти из аккаунта'}</button>
                <button className={cls.delete_button} onClick={deleteAccount}>{deleteAccountError? 'Ошибка' : ((deleteConfirmation) ? 'Подтвердить' : 'Удалить аккаунт')}</button>
                {
                    deleteConfirmation && (
                        <div className={cls.confirm_action}>
                            <input
                                type="password"
                                placeholder={"Введите пароль"}
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                            />
                            <button onClick={()=>setDeleteConfirmation(false)}>X</button>
                        </div>
                    )
                }

                {
                    error && (
                        <div className={cls.error_container}>{error.error}</div>
                    )
                }

            </article>
        </div>
    );
};

export default AccountPage;