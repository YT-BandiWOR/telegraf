const getJwtTokenLifetime = (token: string): number => {
    if (!token) {
        return 0;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    const currentTime: number = Math.floor(Date.now() / 1000);
    const expirationTime: number = payload.exp;

    return expirationTime - currentTime;
};


const JWT = () => {
    return {
        getJwtTokenLifetime
    }
}

export default JWT;