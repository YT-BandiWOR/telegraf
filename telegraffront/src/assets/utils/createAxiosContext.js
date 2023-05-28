const createAxiosContext = ({ url, token = null, method = "POST", headers = {}, body = {} }) => {
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

export default createAxiosContext;