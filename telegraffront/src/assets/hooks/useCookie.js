const useCookie = () => {
    const setCookie = (name, value, expiration) => {
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (expiration) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + expiration * 1000);
            cookieString += `; expires=${expirationDate.toUTCString()}`;
        }

        document.cookie = cookieString;
    };

    const setJWTTokenCookie = (name, value) => {
        const expTime = useJWT().getJwtTokenLifetime(value);
        setCookie(name, value, expTime);
    }

    const getCookie = (name) => {
        const cookiePairs = document.cookie.split(';');

        for (let i = 0; i < cookiePairs.length; i++) {
            const [cookieName, cookieValue] = cookiePairs[i].split('=');

            if (decodeURIComponent(cookieName.trim()) === name) {
                return decodeURIComponent(cookieValue.trim());
            }
        }

        return undefined;
    };

    const removeCookie = (name) => {
        setCookie(name, '', -1);
    };

    return {
        setCookie,
        setJWTTokenCookie,
        getCookie,
        removeCookie,
    };
};

export default useCookie;
