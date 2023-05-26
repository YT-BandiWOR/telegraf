import { useEffect, useState } from 'react';
import axios from 'axios';
import useCookie from './useCookie';
import { useNavigate } from 'react-router-dom';

const createAxiosConfig = ({ url, token = null, method = "POST", headers = {}, body = {} }) => {
    let postConfig = {
        method: method,
        url: url,
        data: {
            ...body
        },
        headers: {
            ...headers
        }
    };

    if (token) {
        postConfig.headers.Authorization = `Bearer ${token}`;
    }

    return postConfig;
};

const useRequest = ({ url, requireAuth, method, headers, body }) => {
    const { getCookie, setJWTTokenCookie } = useCookie();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const sendRequest = async () => {
            setLoading(true);

            try {
                const accessToken = getCookie('access_token');
                const refreshToken = localStorage.getItem('refresh_token');

                if (requireAuth && !refreshToken) {
                    navigate('/login');
                    setLoading(false);
                } else if (requireAuth && !accessToken) {
                    try {
                        const refreshResponse = await axios.request(createAxiosConfig({
                            url: 'http://localhost:3000/refresh',
                            body: {
                                refreshToken: refreshToken
                            }
                        }));
                        setJWTTokenCookie('access_token', refreshResponse.data.token);
                        const newAccessToken = refreshResponse.data.token;

                        try {
                            const serverResponse = await axios.request(createAxiosConfig({
                                url: url,
                                token: newAccessToken,
                                body: body,
                                headers: headers,
                                method: method
                            }));
                            setResponse(serverResponse.data);
                            setLoading(false);
                        } catch (error) {
                            setResponse(error?.response?.data);
                            setLoading(false);
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            navigate('/login');
                        }
                        setError(error?.response?.data);
                        setLoading(false);
                    }
                } else {
                    try {
                        const serverResponse = await axios.request(createAxiosConfig({
                            url: url,
                            token: accessToken,
                            headers: headers,
                            body: body,
                            method: method
                        }));
                        setResponse(serverResponse.data);
                        setLoading(false);
                    } catch (error) {
                        setError(error?.response?.data);
                        setLoading(false);
                    }
                }
            } catch (error) {
                setError(error?.response?.data);
                setLoading(false);
            }
        };

        sendRequest();
    }, [getCookie, setJWTTokenCookie, navigate, url, requireAuth, method, headers, body]);

    return { loading, error, response };
};

export default useRequest;
