const getJwtTokenLifetime = (token) => {
    if (!token) {
        return 0;
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = payload.exp;

    return expirationTime - currentTime;
};


const useJWT = () => {
    return {
        getJwtTokenLifetime
    }
}

export default useJWT;