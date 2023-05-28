import useJWT from "./useJWT.js";

const useStorage = (storage = localStorage) => {
    const set = (key, value, expiration = null) => {
        const data = {
            value: value,
            expiration: expiration ? new Date().getTime() + expiration * 1000 : null
        };
        storage.setItem(key, JSON.stringify(data));
    };

    const setToken = (key, value) => {
        set(key, value, useJWT().getJwtTokenLifetime(value));
    }

    const get = (key) => {
        try {
            const data = JSON.parse(storage.getItem(key));

            if (data && (!data.expiration || data.expiration >= new Date().getTime())) {
                return data.value;
            }
        } catch (error) {
            return storage.getItem(key);
        }

        return undefined;
    };

    const pop = (key) => {
        const value = get(key);
        remove(key);
        return value;
    }

    const remove = (key) => {
        storage.removeItem(key);
    };

    return {
        set,
        setToken,
        get,
        pop,
        remove
    };
};

export default useStorage;