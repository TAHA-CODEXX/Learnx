import { createSlice } from '@reduxjs/toolkit';

const getInitialWishlist = () => {
    try {
        const saved = localStorage.getItem('wishlist');
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Failed to parse wishlist from localStorage", error);
        return [];
    }
};

const initialState = {
    items: getInitialWishlist(),
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action) => {
            const exists = state.items.find(item => item.id === action.payload.id);
            if (!exists) {
                state.items.push(action.payload);
                localStorage.setItem('wishlist', JSON.stringify(state.items));
            }
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            localStorage.setItem('wishlist', JSON.stringify(state.items));
        },
    },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
