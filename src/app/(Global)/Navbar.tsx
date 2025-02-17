'use client'
import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { User, Home, Search, Sun, Moon } from 'lucide-react';
import { InitializerContext, InitializerContextType } from '@/Context/AppInitializer';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const context = useContext(InitializerContext);
    const { darkMode, toggleDarkMode } = context ? context : { darkMode: false, toggleDarkMode: () => {} };

    const { user } = useSelector((state: any) => state.userCache);

    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if ((isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node))) {
                setIsMobileMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] backdrop-blur-sm bg-opacity-80 border-b border-[var(--border-secondary)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-tertiary)] bg-clip-text text-transparent">
                                LINKED POSTS
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:block flex-1 max-w-xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[var(--bg-tertiary)] rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-[var(--text-primary)]"
                            />
                        </div>
                    </div>

                    {/* Navigation - Desktop */}
                    <div className="flex items-center gap-2">
                        <button onClick={toggleDarkMode} className="p-2 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--bg-primary)] transition-colors">
                            {darkMode ? (
                                <Sun className="w-5 h-5 text-yellow-500" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-700" />
                            )}
                        </button>
                        <Link href="/" className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                            <Home className="h-8 w-8" />
                        </Link>

                        {/* User Menu */}
                        <div className="relative ml-2">
                            <Link href={user ? `/User/Profile` : `/Auth/Login`} className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors">
                                {user ? (
                                    <img
                                        src={user.photo}
                                        alt={user.name}
                                        className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--border-secondary)]"
                                    />
                                ) : (
                                    <User className="h-8 w-8 p-1 text-[var(--text-secondary)]" />
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}