import { Loader } from 'lucide-react'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { IPost } from '@/Interfaces/Post'
import PostItem from './Items/PostItem'

export default function LatestPosts() {
    const { token } = useSelector((state: any) => state.userCache);

    const { data: postsData, isLoading } = useQuery({
        queryKey: ['latestPosts'],
        queryFn: async () => {
            if (!token) throw new Error("No token provided");
            const response = await axios.get('https://linked-posts.routemisr.com/posts', {
                headers: { token }
            });
            return response.data;
        },
        retry: (count) => count < 3,
        retryDelay: (failureCount) => Math.min(500 * 2 ** failureCount, 30000),
    });

    const posts: IPost[] = postsData?.posts.sort((a: IPost, b: IPost) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] mt-5">
                <Loader className="w-10 h-10 animate-spin text-blue-500 mb-4" />
                <p className="text-[var(--text-primary)] font-medium">Loading latest posts...</p>
            </div>
        );
    }

    if (!posts?.length) {
        return (
            <div className="w-[70%] mx-auto mt-5 p-8 bg-[var(--bg-secondary)] rounded-xl text-center">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">No posts yet</h2>
                <p className="text-[var(--text-secondary)] mt-2">Be the first to share something with the community!</p>
            </div>
        );
    }

    return (
        <div className="mt-5">
            <div className="w-[70%] mx-auto space-y-6">
                {posts.map((post: IPost) => (
                    <div 
                        key={post._id} 
                        className="bg-[var(--bg-secondary)] px-8 py-4 rounded-xl shadow-md"
                    >
                        <PostItem post={post} />
                    </div>
                ))}
            </div>
        </div>
    );
}
