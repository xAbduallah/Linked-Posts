import { AppDispatch } from '@/lib/store';
import { getUserData } from '@/lib/userCache';
import { useDispatch, useSelector } from 'react-redux';
import React, { createContext, useState, useEffect } from 'react';

export const InitializerContext = createContext({});

export default function AppInitializer({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

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
        setDarkMode(prev => !prev);
    };

    const token = localStorage.getItem('token');
    const { user } = useSelector((state: any) => state.userCache);

    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        if (token && !user) {
            dispatch(getUserData(token));
        }
    }, [token]);

    return (
        <InitializerContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </InitializerContext.Provider>
    );
} 