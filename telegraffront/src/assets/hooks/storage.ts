import JWT from "./JWT";

const storage = (storage: Storage = localStorage) => {
    const set = (key: string, value: any, expiration: number | null = null) => {
        const data = {
            value: value,
            expiration: expiration ? new Date().getTime() + expiration * 1000 : null
        };
        storage.setItem(key, JSON.stringify(data));
    };

    const setToken = (key: string, value: string) => {
        set(key, value, JWT().getJwtTokenLifetime(value));
    }

    const get = (key: string): any | undefined => {
        if (!key) return undefined;

        try {
            const item = storage.getItem(key);
            const data: { value: any; expiration: number | null } | null = item !== null ? JSON.parse(item) : null;

            if (data && (!data.expiration || data.expiration >= new Date().getTime())) {
                return data.value;
            }
        } catch (error) {
            return storage.getItem(key);
        }

        return undefined;
    };

    const pop = (key: string): any => {
        const value = get(key);
        remove(key);
        return value;
    }

    const remove = (key: string) => {
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

export default storage;