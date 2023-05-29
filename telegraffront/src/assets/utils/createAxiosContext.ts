type InterfaceCreateAxiosContext = {
    url: string,
    token?: string | null,
    method?: 'POST' | 'GET',
    headers?: object | null,
    body?: object | null
}

const createAxiosContext = ({ url, token = null, method = "POST", headers = {}, body = {} }: InterfaceCreateAxiosContext) => {
    let postConfig = {
        method: method,
        url: url,
        data: {
            ...body
        },
        headers: {
            ...headers,
            Authorization: ''
        }
    };

    if (token) {
        postConfig.headers.Authorization = `Bearer ${token}`;
    }

    return postConfig;
};

export default createAxiosContext;