import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { OrbitCalcInternalAppDsUser } from '../../api/Api';

// Thunk для входа
export const loginThunk = createAsyncThunk(
    'auth/login',
    async (credentials: { login: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.auth.login(credentials);
            localStorage.setItem('token', response.data.token);
            const role = credentials.login === 'ballistics_expert' ? 'MODERATOR' : 'CLIENT';
            return { login: credentials.login, role };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Ошибка входа');
        }
    }
);

// Thunk для выхода
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
    try { await api.auth.logout(); } catch (e) { console.error(e); }
    localStorage.removeItem('token');
});

// Thunk для регистрации
export const registerThunk = createAsyncThunk(
    'auth/register',
    async (userData: OrbitCalcInternalAppDsUser) => {
        const response = await api.auth.register(userData);
        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isAuthenticated: false,
        login: '',
        role: 'GUEST',
        loading: false,
        error: null as string | null,
    },
    reducers: {
        restoreAuth(state, action) {
            state.isAuthenticated = true;
            state.login = action.payload.login;
            state.role = action.payload.role;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.login = action.payload.login;
                state.role = action.payload.role;
                state.loading = false;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.login = '';
                state.role = 'GUEST';
            });
    }
});

export const { restoreAuth } = authSlice.actions;
export default authSlice.reducer;