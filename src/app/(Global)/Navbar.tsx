'use client'
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Mail, Bell, Menu, User, Home, Search } from 'lucide-react';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isLoggedIn } = useSelector((state: any) => state.userCache);

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
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
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
                    <div className="hidden md:flex items-center gap-2">
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="md:hidden border-t border-[var(--border-secondary)]">
                    <div className="px-4 py-3 space-y-3">
                        {/* Mobile Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-secondary)]" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[var(--bg-tertiary)] rounded-full py-2 pl-10 pr-4 focus:outline-none"
                            />
                        </div>

                        <button className="flex w-full items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                            <span className="flex items-center gap-3">
                                <Mail className="h-6 w-6" />
                                Messages
                            </span>
                            <span className="bg-blue-500 px-2 py-1 rounded-full text-xs text-white">4</span>
                        </button>

                        <button className="flex w-full items-center justify-between p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
                            <span className="flex items-center gap-3">
                                <Bell className="h-6 w-6" />
                                Notifications
                            </span>
                            <span className="bg-blue-500 px-2 py-1 rounded-full text-xs text-white">17</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}