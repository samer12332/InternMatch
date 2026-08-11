import axios from "axios";

const accessTokenKey = "internmatch.accessToken";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem(accessTokenKey);

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export { accessTokenKey };
