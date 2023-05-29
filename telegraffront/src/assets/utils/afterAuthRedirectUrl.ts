import storage from "../hooks/storage";

const afterAuthRedirectUrl = () => {
    const set = (url: string) => {
        storage(sessionStorage).set('after_auth_url', url);
    }

    const get = (url: string) => {
        return storage(sessionStorage).pop('after_auth_url');
    }

    return {
        set,
        get
    }
}

export default afterAuthRedirectUrl;