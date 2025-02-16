import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const deletePost = createAsyncThunk('post/delete', async ({ postId, token }: { postId: string; token: string }, { rejectWithValue }) => {
    try {
        const loginResponse = await axios.delete(`https://linked-posts.routemisr.com/posts/${postId}`, { headers: { token: token } });
        return loginResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
}
);
export const addComment = createAsyncThunk('post/addComment', async ({ values, token }: { values: any; token: string }, { rejectWithValue }) => {
    try {
        const loginResponse = await axios.post(`https://linked-posts.routemisr.com/comments`, values, { headers: { token: token } });
        return loginResponse.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
}
);

export const postSlice = createSlice({
    name: 'post',
    initialState: {},
    reducers: {},
});
