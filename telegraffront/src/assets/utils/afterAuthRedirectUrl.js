import useStorage from "../hooks/useStorage.js";

const afterAuthRedirectUrl = () => {
    const set = (url) => {
        useStorage(sessionStorage).set('after_auth_url', url);
    }

    const get = (url) => {
        return useStorage(sessionStorage).pop('after_auth_url');
    }

    return {
        set,
        get
    }
}

export default afterAuthRedirectUrl;