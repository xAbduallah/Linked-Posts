import axios from 'axios';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UserState } from '@/Interfaces/User';

const initialState: UserState = {
    user: null,
    token: '',
    isLoggedIn: false,
    isLoading: false,
    message: null,
};

export const doLogin = createAsyncThunk('userCache/doLogin', async (values: any, { rejectWithValue }) => {
    try {
        const loginResponse = await axios.post('https://linked-posts.routemisr.com/users/signin', values);
        return loginResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
}
);

export const getUserData = createAsyncThunk('userCache/getUserData', async (token: string, { rejectWithValue }) => {
    try {
        const response = await axios.get('https://linked-posts.routemisr.com/users/profile-data', {
            headers: { token }
        });
        return { ...response.data, token };
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Failed to fetch user data.");
    }
}
);

function InitLoginReducer(builder: any) {
    builder.addCase(doLogin.pending, (state: any) => {
        state.isLoading = true;
        state.message = null;
    }).addCase(doLogin.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        if (action.payload.message === "success") {
            state.token = action.payload.token;
            localStorage.setItem('token', state.token);
        }
    }).addCase(doLogin.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.token = '';
        state.isLoggedIn = false;
        localStorage.removeItem('token');
        state.message = action.payload as string;
    });
}

function InitUserDataReducer(builder: any) {
    builder.addCase(getUserData.fulfilled, (state: any, action: any) => {        
        if (action.payload.message === "success") {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        }
        state.isLoading = false;
    }).addCase(getUserData.pending, (state: any) => {
        state.isLoading = true;
        state.message = null;
    }).addCase(getUserData.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.user = null;
        state.token = "";
        state.isLoggedIn = false;
        localStorage.removeItem("token");
        state.message = action.payload as string;
    });
}

export const userCache = createSlice({
    name: 'userCache',
    initialState,
    reducers: {
        handleLogout: (state, action) => {
            state.isLoggedIn = false;
            state.user = null;
            state.token = "";
            localStorage.removeItem("token");
        }
    },
    extraReducers: (builder) => {
        InitLoginReducer(builder);
        InitUserDataReducer(builder);
    },
});

export const userCacheActions = userCache.actions;
export const userActions = userCache.actions;
export default userCache.reducer;
