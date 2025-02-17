import { AppDispatch } from '@/lib/store';
import { getUserData } from '@/lib/userCache';
import { userActions } from '@/lib/userCache';
import { useDispatch, useSelector } from 'react-redux';
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export type InitializerContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};
export const InitializerContext = createContext<InitializerContextType | null>(null);

export default function AppInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch<AppDispatch>();
    const [darkMode, setDarkMode] = useState(false);
    const { user, token: userToken } = useSelector((state: any) => state.userCache);
    const { setToken } = userActions;
    useEffect(() => {
        const savedTheme = Cookies.get('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            Cookies.set('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            Cookies.set('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (!userToken && token) {
            dispatch(setToken(token));
        }
    }, []);

    useEffect(() => {
        if (userToken && !user) {
            dispatch(getUserData(userToken));
        }
    }, [dispatch, userToken]);

    return (
        <InitializerContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </InitializerContext.Provider>
    );
}
