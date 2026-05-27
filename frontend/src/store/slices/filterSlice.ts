import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const filterSlice = createSlice({
    name: 'filter',
    initialState: {
        searchQuery: '',
    },
    reducers: {
        setSearchQuery(state, action: PayloadAction<string>) {
            state.searchQuery = action.payload;
        },
        clearFilters(state) {
            state.searchQuery = '';
        }
    }
});

export const { setSearchQuery, clearFilters } = filterSlice.actions;
export default filterSlice.reducer;