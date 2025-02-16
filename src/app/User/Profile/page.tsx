'use client'

import axios from 'axios';
import React from 'react';
import { IPost } from '@/Interfaces/Post';
import { userActions } from '@/lib/userCache';
import { useQuery } from '@tanstack/react-query';
import CreatePost from '@/app/(Global)/CreatePost';
import PostItem from '@/app/(Global)/Items/PostItem';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarDays, Loader, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Profile() {

    const { token, user } = useSelector((state: any) => state.userCache);
    const { handleLogout } = userActions;
    const dispatch = useDispatch();

    const { data: postsData, isLoading: postsLoading } = useQuery({
        queryKey: ['myPosts', user?._id],
        queryFn: async () => {
            if (!token || !user?._id) throw new Error("No token provided");
            const response = await axios.get(
                `https://linked-posts.routemisr.com/users/${user?._id}/posts`,
                { headers: { token } }
            );
            return response.data;
        },
        retry: (count) => count < 3,
        retryDelay: (failureCount) => Math.min(500 * 2 ** failureCount, 30000),
        enabled: !!token && !!user?._id
    });

    const posts: IPost[] = postsData?.posts.sort((a: IPost, b: IPost) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (postsLoading && !posts) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-start justify-center min-h-screen">
                <Link href="/Auth/Login" className='p-4 bg-[var(--bg-secondary)] rounded-xl text-xl font-semibold cursor-pointer hover:text-[var(--text-secondary)]'>Login to create a post</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="relative mb-8">
                {/* Cover */}
                <div className="h-48 w-full rounded-xl bg-[#00487D]">
                    <img
                        src='https://yt3.googleusercontent.com/ytc/AIdro_krEjITi07cOEBrX0041BBduaCdRKLUO4o6MmV6C5VfiJo'
                        alt={user?.name}
                        className="w-full h-full object-contain rounded-xl"
                    />
                </div>

                <div className='flex w-[97%] mx-auto justify-between items-center relative -mt-16 bg-[var(--bg-secondary)] rounded-xl p-6 shadow-lg border border-[var(--border-secondary)]'>
                    {/* Profile Info */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative">
                            <img
                                src={user?.photo}
                                alt={user?.name}
                                className="w-32 h-32 rounded-full border-4 border-[var(--bg-secondary)] object-cover"
                            />
                            <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-[var(--bg-secondary)]" />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{user?.name}</h1>
                            <p className="text-[var(--text-secondary)] mb-4">{user?.email}</p>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-6 mb-4">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-[var(--text-primary)]">{posts?.length || 0}</div>
                                    <div className="text-sm text-[var(--text-secondary)]">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-[var(--text-primary)]">2.5k</div>
                                    <div className="text-sm text-[var(--text-secondary)]">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-[var(--text-primary)]">1.8k</div>
                                    <div className="text-sm text-[var(--text-secondary)]">Following</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-[var(--text-secondary)]">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>Egypt</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4" />
                                    <span>Joined 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex self-start gap-2'>
                        <button className='bg-[rgba(255,0,0,0.9)] text-[var(--text-primary)] px-4 py-2 rounded-xl cursor-pointer' onClick={() => { dispatch(handleLogout()); }}>Logout</button>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <CreatePost />
            </div>

            {/* Posts */}
            <div className="w-[70%] space-y-6 mx-auto">
                {posts?.length === 0 ? (
                    <div className="text-center py-8 bg-[var(--bg-secondary)] rounded-xl">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">No posts yet</h2>
                        <p className="text-[var(--text-secondary)] mt-2">
                            Share your first post with the community!
                        </p>
                    </div>
                ) : (
                    posts?.map((post: IPost) => (
                        <div key={post._id} className="bg-[var(--bg-secondary)] px-8 py-4 rounded-xl shadow-md">
                            <PostItem post={post} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
