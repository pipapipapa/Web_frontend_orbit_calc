import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';
import type { InternalAppHandlerM2MRequest } from '../../api/Api';


export const fetchMissionDraftThunk = createAsyncThunk('mission', async () => {
    const res = await api.missions.draft();
    return res.data;
});
export const addOrbitToMissionThunk = createAsyncThunk('mission/addOrbit',
    async (payload: InternalAppHandlerM2MRequest, { dispatch }) => {
    await api.missionOrbitItems.create(payload);
    dispatch(fetchMissionDraftThunk());
    }
);

// 1. Метод М-М: Сохранить/Изменить
export const updateM2MThunk = createAsyncThunk('mission/updateM2M', async (payload: any) => {
    await api.missionOrbitItems.update(payload);
});

// 2. Метод М-М: Удалить
export const deleteM2MThunk = createAsyncThunk('mission/deleteM2M', async (payload: any, { dispatch }) => {
    await api.missionOrbitItems.delete(payload);
    dispatch(fetchMissionDraftThunk());
});

// 3. Метод Заявка: Обновить массу
export const updateMissionMassThunk = createAsyncThunk('mission/updateMass', async (data: { id: number, mass: number }) => {
    await api.missions.update(data.id, { satellite_mass_kg: data.mass });
});

// 4. Метод Заявка: Сформировать
export const formMissionThunk = createAsyncThunk('mission/form', async (id: number) => {
    await api.missions.form(id);
});

// 5. Метод Заявка: Удалить
export const deleteMissionThunk = createAsyncThunk('mission/delete', async (id: number, { dispatch }) => {
    await api.missions.delete(id);
    dispatch(clearMissionDraft());
});

const missionSlice = createSlice({
    name: 'mission',
    initialState: { draftId: null as number | null, itemsCount: 0, loading: false },
    reducers: {
        clearMissionDraft(state) {
            state.draftId = null;
            state.itemsCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMissionDraftThunk.fulfilled, (state, action) => {
            state.draftId = action.payload.draft_id || null;
            state.itemsCount = action.payload.items_count || 0;
        });
    }
});

export const { clearMissionDraft } = missionSlice.actions;
export default missionSlice.reducer;