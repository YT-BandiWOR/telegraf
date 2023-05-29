import JWT from "./JWT";


const cookie = () => {
    const set = (name: string, value: string, expiration: number) => {
        let cookieString: string = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (expiration) {
            const expirationDate = new Date();
            expirationDate.setTime(expirationDate.getTime() + expiration * 1000);
            cookieString += `; expires=${expirationDate.toUTCString()}`;
        }

        document.cookie = cookieString;
    };

    const setToken = (name: string, value: string) => {
        const expTime = JWT().getJwtTokenLifetime(value);
        set(name, value, expTime);
    };

    const get = (name: string): string | undefined => {
        const cookiePairs: string[] = document.cookie.split(';');

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

    const has = (name: string) => {
        return !!(get(name));
    }

    const remove = (name: string) => {
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

export default cookie;
