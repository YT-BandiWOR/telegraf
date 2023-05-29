// @ts-ignore
import axios, {AxiosError, AxiosResponse} from "axios";
import createAxiosContext from "../utils/createAxiosContext";
import cookie from "../hooks/cookie";
import storage from "../hooks/storage";
import apiConstants from "../constants/apiConstants";

const register_url = '/register';
const login_url = '/login';
const refresh_url = '/refresh';
const me_url = '/me';
const logout_url = '/logout';

class Response {
    data: Record<string, any>;
    status: number;

    constructor(data: Record<string, any>, status: number) {
        this.data = data;
        this.status = status;
    }
}

class Error {
    data: Record<string, any>;
    status: number;

    constructor(status: number, data: Record<string, any>) {
        this.data = data;
        this.status = status;
    }
}

interface TelegrafAPI {
    login: (username: string, password: string) => Promise<Response>;
    register: (username: string, email: string, password: string) => Promise<Response>;
    refresh: (refreshToken: string) => Promise<Response>;
    me: () => Promise<Response>;
    logout: () => Promise<Response>;
}

const telegrafAPI = (origin = apiConstants.originUrl): TelegrafAPI => {
    const tryUpdateToken = async (): Promise<void> => {
        const cookieTool = cookie();
        const storageTool = storage(localStorage);
        let token = cookieTool.get('access_token');
        let refreshToken = storageTool.get('refresh_token');
        if (!token && refreshToken) {
            let response: Response;

            try {
                response = await refresh(refreshToken);
            } catch (error: AxiosError) {
                storageTool.remove('refresh_token');
                cookieTool.remove('access_token');
                throw new Error(error.status, error.response.data);
            }

            const new_token: string | undefined = response.data.token;
            if (new_token === undefined) {
                cookieTool.remove('access_token');
                storageTool.remove('refresh_token');
                throw new Error(401, {error: 'Ошибка при обновлении токена.'});
            }

            cookieTool.setToken('access_token', new_token);

        } else if (!refreshToken) {
            throw new Error(401, {error: 'Необходима авторизация.'});
        }
    };

    const register = async (username: string, email: string, password: string): Promise<Response> => {
        try {
            const response: AxiosResponse<any> = await axios.post(origin + register_url, {
                username,
                email,
                password
            });
            return new Response(response.data, response.status);
        } catch (error: AxiosError) {
            throw new Error(error.response.status, error.response.data);
        }
    };

    const login = async (username: string, password: string): Promise<Response> => {
        try {
            const response: AxiosResponse<any> = await axios.post(origin + login_url, {
                username,
                password
            });
            return new Response(response.data, response.status);
        } catch (error: AxiosError) {
            throw new Error(error.response.status, error.response.data);
        }
    };

    const refresh = async (refreshToken: string): Promise<Response> => {
        try {
            const response: AxiosResponse<any> = await axios.request(createAxiosContext({
                url: origin + refresh_url,
                body: {
                    refreshToken
                }
            }));
            return new Response(response.data, response.status);
        } catch (error: AxiosError) {
            throw new Error(error.status, error.response.data);
        }
    };

    const me = async (): Promise<Response> => {
        try {
            await tryUpdateToken();
            const token = cookie().get('access_token');
            const response: AxiosResponse<any> = await axios.request(createAxiosContext({
                url: origin + me_url,
                method: 'GET',
                token
            }));
            return new Response(response.data, response.status);
        } catch (error: AxiosError | Error) {
            if (error instanceof Error) {
                throw error;
            } else if (error instanceof AxiosError) {
                throw new Error(error.status, error.response.data);
            }
            throw error;
        }
    };

    const logout = async (): Promise<Response> => {
        try {
            await tryUpdateToken();
            const token = cookie().get('access_token');
            const refreshToken = storage(localStorage).get('refresh_token');

            const response: AxiosResponse<any> = await axios.request(createAxiosContext({
                url: origin + logout_url,
                method: 'GET',
                token,
                body: {
                    refreshToken
                }
            }));
            return new Response(response.data, response.status);
        } catch (error: AxiosError | Error) {
            if (error instanceof Error) {
                throw error;
            } else if (error instanceof AxiosError) {
                throw new Error(error.status, error.response.data);
            }
            throw error;
        }
    };

    return {
        login,
        register,
        refresh,
        me,
        logout
    };
};

export default telegrafAPI;
