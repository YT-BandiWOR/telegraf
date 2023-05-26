import React from 'react';
import cls from "./App.module.scss";
import Header from "./assets/components/header/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Footer from "./assets/components/footer/Footer.jsx";
import NotFound from "./assets/errors/NotFound.jsx";
import LoginPage from "./assets/pages/authorization/LoginPage.jsx";
import RegistrationPage from "./assets/pages/authorization/RegistrationPage.jsx";

const App = () => {
    return (
        <div className={cls.app}>
            <div>
                <Header/>
                <Routes>
                    <Route path={'/'} element={<main>Content</main>}/>
                    <Route path={'/login'} element={<LoginPage/>}/>
                    <Route path={'/register'} element={<RegistrationPage/>}/>
                    <Route path={'*'} element={<NotFound/>}/>
                </Routes>
            </div>
            <Footer/>
        </div>
    );
};

export default App;