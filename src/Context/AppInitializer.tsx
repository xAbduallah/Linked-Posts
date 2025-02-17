import { AppDispatch } from '@/lib/store';
import { getUserData } from '@/lib/userCache';
import { useDispatch, useSelector } from 'react-redux';
import React, { createContext, useState, useEffect } from 'react';

export type InitializerContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};
export const InitializerContext = createContext<InitializerContextType | null>(null);

export default function AppInitializer({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        } else {
            setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);
    }, []);

    const { user } = useSelector((state: any) => state.userCache);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (token && !user) {
            dispatch(getUserData(token));
        }
    }, [token, user, dispatch]);

    return (
        <InitializerContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </InitializerContext.Provider>
    );
}
