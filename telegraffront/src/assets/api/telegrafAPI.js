import axios from "axios";
import createAxiosContext from "../utils/createAxiosContext.js";
import useCookie from "../hooks/useCookie.js";
import useStorage from "../hooks/useStorage.js";

const register_url = '/register';
const login_url = '/login';
const refresh_url = '/refresh';
const me_url = '/me';
const logout_url = '/logout';


const telegrafAPI = (origin = "http://localhost:3000") => {
    const tryUpdateToken = async () => {
        let [token, refreshToken] = [useCookie().get('access_token'), useStorage().get('refresh_token')];
        if (!token && refreshToken) {
            try {
                token = await refresh(refreshToken);
                useCookie().setToken('access_token', token);
            } catch (error) {
                useStorage().remove('refresh_token');
                useCookie().remove('access_token');
                throw error;
            }
        } else if (!refreshToken) {
            throw {
                response: {
                    message: 'Необходима авторизация.',
                    status: 401
                }
            }
        }
    }

    const register = async (username, email, password) => {
        try {
            const response = await axios.post(origin+register_url, {
                username, email, password
            })
            return response.data;
        } catch (error) {
            throw error.response;
        }
    }

    const login = async (username, password) => {
        try {
            const response = await axios.post(origin+login_url, {
                username, password
            })
            return response.data;
        } catch (error) {
            throw error.response;
        }
    }

    const refresh = async (refreshToken) => {
        try {
            const response = await axios.request(createAxiosContext(
                {
                    url: origin+refresh_url,
                    body: {
                        refreshToken
                    }
                }
            ))
            return response.data.token;

        } catch (error) {
            throw error.response;
        }
    }

    const me = async () => {
        try {
            await tryUpdateToken();
            const token = useCookie().get('access_token');

            const response = await axios.request(createAxiosContext({
                url: origin + me_url,
                method: 'GET',
                token
            }));

            return response.data;

        } catch (error) {
            throw error.response;
        }
    }

    const logout = async () => {
        try {
            await tryUpdateToken();
            const token = useCookie().get('access_token');
            const refreshToken = useStorage().get('refresh_token');

            const response = await axios.request(createAxiosContext({
                url: origin + logout_url,
                method: 'POST',
                token,
                body: {
                    refreshToken
                }
            }));

            return response.data;

        } catch (error) {
            throw error.response;
        }
    }

    return {
        login,
        register,
        refresh,
        me,
        logout
    }
}

export default telegrafAPI;