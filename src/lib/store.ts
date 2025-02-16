import { configureStore } from "@reduxjs/toolkit";
import { userCache } from "./userCache";

export const store = configureStore({
    reducer: {
        userCache: userCache.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch