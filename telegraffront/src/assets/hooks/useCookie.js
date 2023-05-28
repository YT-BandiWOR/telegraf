import useJWT from "./useJWT";


const useCookie = () => {
    const set = (name, value, expiration) => {
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (expiration) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + expiration * 1000);
            cookieString += `; expires=${expirationDate.toUTCString()}`;
        }

        document.cookie = cookieString;
    };

    const setToken = (name, value) => {
        const expTime = useJWT().getJwtTokenLifetime(value);
        set(name, value, expTime);
    };

    const get = (name) => {
        const cookiePairs = document.cookie.split(';');

        for (let i = 0; i < cookiePairs.length; i++) {
            const [cookieName, cookieValue] = cookiePairs[i].split('=');

            if (!cookieValue || !cookieName) {
                continue;
            }

            if (decodeURIComponent(cookieName.trim()) === name) {
                return decodeURIComponent(cookieValue.trim());
            }
        }

        return undefined;
    };

    const has = (name) => {
        return !!(get(name));
    }

    const remove = (name) => {
        set(name, '', -1);
    };

    return {
        set,
        get,
        has,
        setToken,
        remove,
    };
};

export default useCookie;
