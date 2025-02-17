import axios from 'axios';
import Cookies from 'js-cookie';
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
        state.isLoggedIn = false;
    }).addCase(doLogin.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        if (action.payload.message === "success") {
            state.token = action.payload.token;
            Cookies.set('token', state.token);
        }
    }).addCase(doLogin.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.token = '';
        state.isLoggedIn = false;
        Cookies.remove('token');
        state.message = action.payload as string;
    });
}

function InitUserDataReducer(builder: any) {
    builder.addCase(getUserData.fulfilled, (state: any, action: any) => {
        if (action.payload.message === "success") {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoggedIn = true;
        }
        state.isLoading = false;
    }).addCase(getUserData.pending, (state: any) => {
        state.isLoading = true;
        state.message = null;
        state.isLoggedIn = false;
    }).addCase(getUserData.rejected, (state: any, action: any) => {
        state.isLoading = false;
        state.user = null;
        state.token = "";
        state.isLoggedIn = false;
        Cookies.remove("token");
        state.message = action.payload as string;
    });
}

export const userCache = createSlice({
    name: 'userCache',
    initialState,
    reducers: {
        logoutUser: (state) => {
            Cookies.remove("token");
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;
        },
        setToken: (state, action) => {
            state.token = action.payload
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
