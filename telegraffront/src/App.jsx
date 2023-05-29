import React, {useEffect, useState} from 'react';
import cls from "./App.module.scss";
import Header from "./assets/components/header/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Footer from "./assets/components/footer/Footer.jsx";
import NotFound from "./assets/errors/NotFound.jsx";
import LoginPage from "./assets/pages/authorization/LoginPage.jsx";
import RegistrationPage from "./assets/pages/authorization/RegistrationPage.jsx";
import telegrafAPI from "./assets/api/telegrafAPI.ts";

const App = () => {
    const [account, setAccount] = useState(null);

    useEffect(()=> {
        async function fetchData() {
            try {
                const response = await telegrafAPI().me();
                setAccount(response.data.user);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

    return (
        <div className={cls.app}>
            <div>
                <Header account={account}/>
                <div>
                    <Routes>
                        <Route path={'/'} element={<main>Content</main>}/>
                        <Route path={'/login'} element={<LoginPage/>}/>
                        <Route path={'/register'} element={<RegistrationPage/>}/>
                        <Route path={'*'} element={<NotFound/>}/>
                    </Routes>
                </div>

            </div>
            <Footer/>
        </div>
    );
};

export default App;