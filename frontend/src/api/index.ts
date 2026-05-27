import { Api } from './Api';

const apiClient = new Api({
    baseURL: '/',
});

apiClient.instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const api = {
    auth: {
        login: apiClient.api.loginCreate,
        logout: apiClient.api.logoutCreate,
        register: apiClient.api.registerCreate,
    },
    orbits: {
        list: apiClient.api.orbitsList,
        detail: apiClient.api.orbitsDetail,
    },
    missions: {
        draft: apiClient.api.missionList,
        list: apiClient.api.missionsList,
        detail: apiClient.api.missionsDetail,
        update: apiClient.api.missionsUpdate,
        form: apiClient.api.missionsFormUpdate,
        complete: apiClient.api.missionsCompleteUpdate,
        delete: apiClient.api.missionsDelete,
    },
    missionOrbitItems: {
        create: apiClient.api.missionOrbitItemsCreate,
        update: apiClient.api.missionOrbitItemsUpdate,
        delete: apiClient.api.missionOrbitItemsDelete,
    }
};